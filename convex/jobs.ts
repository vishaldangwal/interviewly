import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getTargetForType } from "./activities";

// Create a new job (Admin/Interviewer only)
export const createJob = mutation({
  args: {
    title: v.string(),
    company: v.string(),
    location: v.string(),
    type: v.union(
      v.literal("Full-time"),
      v.literal("Part-time"),
      v.literal("Contract"),
      v.literal("Internship"),
      v.literal("Remote")
    ),
    description: v.string(),
    requirements: v.array(v.string()),
    responsibilities: v.array(v.string()),
    salary: v.optional(v.string()),
    experienceLevel: v.union(
      v.literal("Entry"),
      v.literal("Mid"),
      v.literal("Senior"),
      v.literal("Lead"),
      v.literal("Executive")
    ),
    skills: v.array(v.string()),
    deadline: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("User is not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user || (user.role !== "interviewer" && user.role !== "candidate")) {
      throw new Error("Only interviewers can create jobs");
    }

    return await ctx.db.insert("jobs", {
      ...args,
      postedBy: identity.subject,
      status: "Active",
      postedAt: Date.now(),
      applicationsCount: 0,
    });
  },
});

// Get all active jobs (for candidates to browse)
export const getAllActiveJobs = query({
  args: {
    limit: v.optional(v.number()),
    offset: v.optional(v.number()),
    type: v.optional(v.union(
      v.literal("Full-time"),
      v.literal("Part-time"),
      v.literal("Contract"),
      v.literal("Internship"),
      v.literal("Remote")
    )),
    experienceLevel: v.optional(v.union(
      v.literal("Entry"),
      v.literal("Mid"),
      v.literal("Senior"),
      v.literal("Lead"),
      v.literal("Executive")
    )),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("User is not authenticated");

    let query = ctx.db
      .query("jobs")
      .withIndex("by_status", (q) => q.eq("status", "Active"))
      .order("desc");

    if (args.type) {
      query = query.filter((q) => q.eq(q.field("type"), args.type));
    }

    if (args.experienceLevel) {
      query = query.filter((q) => q.eq(q.field("experienceLevel"), args.experienceLevel));
    }

    const jobs = await query.collect();

    // Apply pagination
    const offset = args.offset || 0;
    const limit = args.limit || 10;
    const paginatedJobs = jobs.slice(offset, offset + limit);

    return {
      jobs: paginatedJobs,
      total: jobs.length,
      hasMore: offset + limit < jobs.length,
    };
  },
});

// Get a specific job by ID
export const getJobById = query({
  args: { jobId: v.id("jobs") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("User is not authenticated");

    const job = await ctx.db.get(args.jobId);
    if (!job) throw new Error("Job not found");

    return job;
  },
});

// Check if user has already applied for a specific job
export const getUserApplicationForJob = query({
  args: { jobId: v.id("jobs") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("User is not authenticated");

    const application = await ctx.db
      .query("jobApplications")
      .withIndex("by_job_id", (q) => q.eq("jobId", args.jobId))
      .filter((q) => q.eq(q.field("applicantId"), identity.subject))
      .first();

    return application;
  },
});

// Get jobs posted by a specific admin/interviewer
export const getJobsByPoster = query({
  args: {
    limit: v.optional(v.number()),
    offset: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("User is not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user || (user.role !== "interviewer" && user.role !== "candidate")) {
      throw new Error("Only interviewers can view their posted jobs");
    }

    const jobs = await ctx.db
      .query("jobs")
      .withIndex("by_posted_by", (q) => q.eq("postedBy", identity.subject))
      .order("desc")
      .collect();

    const offset = args.offset || 0;
    const limit = args.limit || 10;
    const paginatedJobs = jobs.slice(offset, offset + limit);

    return {
      jobs: paginatedJobs,
      total: jobs.length,
      hasMore: offset + limit < jobs.length,
    };
  },
});

// Apply for a job
export const applyForJob = mutation({
  args: {
    jobId: v.id("jobs"),
    coverLetter: v.string(),
    resume: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("User is not authenticated");

    // Check if user has already applied for this job
    const existingApplication = await ctx.db
      .query("jobApplications")
      .withIndex("by_job_id", (q) => q.eq("jobId", args.jobId))
      .filter((q) => q.eq(q.field("applicantId"), identity.subject))
      .first();

    if (existingApplication) {
      throw new Error("You have already applied for this job");
    }

    // Create the application
    const application = await ctx.db.insert("jobApplications", {
      jobId: args.jobId,
      applicantId: identity.subject,
      coverLetter: args.coverLetter,
      resume: args.resume,
      status: "Pending",
      appliedAt: Date.now(),
    });

    // Increment applications count for the job
    const job = await ctx.db.get(args.jobId);
    if (job) {
      await ctx.db.patch(args.jobId, {
        applicationsCount: job.applicationsCount + 1,
      });

      // Get applicant details for notification
      const applicant = await ctx.db
        .query("users")
        .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
        .first();

      // Create activity notification for job poster
      const activityResult = await ctx.db.insert("activities", {
        type: "application_submitted",
        target: getTargetForType("application_submitted"),
        title: "New Application Received",
        description: `A new application has been submitted for the ${job.title} position at ${job.company}`,
        userId: job.postedBy,
        relatedUserId: identity.subject,
        jobId: args.jobId,
        applicationId: application,
        metadata: {
          jobTitle: job.title,
          companyName: job.company,
          applicantName: applicant?.name || "Unknown Applicant",
          notes: "",
        },
        isRead: false,
        createdAt: Date.now(),
        emailSent: false,
      });

      // Return activity data for email sending
      return {
        application,
        activityData: {
          user: applicant ? { name: applicant.name, email: applicant.email } : null,
          metadata: {
            jobTitle: job.title,
            companyName: job.company,
            applicantName: applicant?.name || "Unknown Applicant",
            notes: "",
          },
          type: "application_submitted",
        },
      };
    }

    return { application };
  },
});

// Get applications for a specific job (Admin/Interviewer only)
export const getJobApplications = query({
  args: { jobId: v.id("jobs") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("User is not authenticated");

    const job = await ctx.db.get(args.jobId);
    if (!job) throw new Error("Job not found");

    // Check if the user is the one who posted the job
    if (job.postedBy !== identity.subject) {
      throw new Error("You can only view applications for jobs you posted");
    }

    const applications = await ctx.db
      .query("jobApplications")
      .withIndex("by_job_id", (q) => q.eq("jobId", args.jobId))
      .order("desc")
      .collect();

    // Get applicant details for each application
    const applicationsWithApplicants = await Promise.all(
      applications.map(async (application) => {
        const applicant = await ctx.db
          .query("users")
          .withIndex("by_clerk_id", (q) => q.eq("clerkId", application.applicantId))
          .first();

        return {
          ...application,
          applicant,
        };
      })
    );

    return applicationsWithApplicants;
  },
});

// Get applications submitted by the current user
export const getMyApplications = query({
  args: {
    limit: v.optional(v.number()),
    offset: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("User is not authenticated");

    const applications = await ctx.db
      .query("jobApplications")
      .withIndex("by_applicant_id", (q) => q.eq("applicantId", identity.subject))
      .order("desc")
      .collect();

    const offset = args.offset || 0;
    const limit = args.limit || 10;
    const paginatedApplications = applications.slice(offset, offset + limit);

    // Get job details for each application
    const applicationsWithJobs = await Promise.all(
      paginatedApplications.map(async (application) => {
        const job = await ctx.db.get(application.jobId);
        return {
          ...application,
          job,
        };
      })
    );

    return {
      applications: applicationsWithJobs,
      total: applications.length,
      hasMore: offset + limit < applications.length,
    };
  },
});

// Update application status (Admin/Interviewer only)
export const updateApplicationStatus = mutation({
  args: {
    applicationId: v.id("jobApplications"),
    status: v.union(
      v.literal("Pending"),
      v.literal("Under Review"),
      v.literal("Shortlisted"),
      v.literal("Rejected"),
      v.literal("Hired")
    ),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("User is not authenticated");

    const application = await ctx.db.get(args.applicationId);
    if (!application) throw new Error("Application not found");

    const job = await ctx.db.get(application.jobId);
    if (!job || job.postedBy !== identity.subject) {
      throw new Error("You can only update applications for jobs you posted");
    }

    const oldStatus = application.status;
    const newStatus = args.status;

    // Update the application
    await ctx.db.patch(args.applicationId, {
      status: args.status,
      notes: args.notes,
      reviewedAt: Date.now(),
      reviewedBy: identity.subject,
    });

    // Get applicant details for notification
    const applicant = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", application.applicantId))
      .first();

    // Determine activity type based on status change
    let activityType: "application_reviewed" | "application_shortlisted" | "application_rejected" | "application_hired" = "application_reviewed";
    
    if (newStatus === "Shortlisted") {
      activityType = "application_shortlisted";
    } else if (newStatus === "Rejected") {
      activityType = "application_rejected";
    } else if (newStatus === "Hired") {
      activityType = "application_hired";
    }

    // Create activity notification for applicant
    const activityResult = await ctx.db.insert("activities", {
      type: activityType,
      target: getTargetForType(activityType),
      title: `Application ${newStatus}`,
      description: `Your application for ${job.title} at ${job.company} has been ${newStatus.toLowerCase()}`,
      userId: application.applicantId,
      relatedUserId: identity.subject,
      jobId: application.jobId,
      applicationId: args.applicationId,
      metadata: {
        jobTitle: job.title,
        companyName: job.company,
        applicantName: applicant?.name || "Unknown Applicant",
        oldStatus: oldStatus,
        newStatus: newStatus,
        notes: args.notes || "",
      },
      isRead: false,
      createdAt: Date.now(),
      emailSent: false,
    });

    return { 
      success: true,
      activityData: {
        user: applicant ? { name: applicant.name, email: applicant.email } : null,
        metadata: {
          jobTitle: job.title,
          companyName: job.company,
          applicantName: applicant?.name || "Unknown Applicant",
          oldStatus: oldStatus,
          newStatus: newStatus,
          notes: args.notes || "",
        },
        type: activityType,
      },
    };
  },
});

// Update job status (Admin/Interviewer only)
export const updateJobStatus = mutation({
  args: {
    jobId: v.id("jobs"),
    status: v.union(
      v.literal("Active"),
      v.literal("Closed"),
      v.literal("Draft")
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("User is not authenticated");

    const job = await ctx.db.get(args.jobId);
    if (!job || job.postedBy !== identity.subject) {
      throw new Error("You can only update jobs you posted");
    }

    return await ctx.db.patch(args.jobId, {
      status: args.status,
    });
  },
});

// Delete a job (Admin/Interviewer only)
export const deleteJob = mutation({
  args: { jobId: v.id("jobs") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("User is not authenticated");

    const job = await ctx.db.get(args.jobId);
    if (!job || job.postedBy !== identity.subject) {
      throw new Error("You can only delete jobs you posted");
    }

    // Delete all applications for this job first
    const applications = await ctx.db
      .query("jobApplications")
      .withIndex("by_job_id", (q) => q.eq("jobId", args.jobId))
      .collect();

    for (const application of applications) {
      await ctx.db.delete(application._id);
    }

    // Delete the job
    await ctx.db.delete(args.jobId);
    return { success: true };
  },
});

// Search jobs by keyword
export const searchJobs = query({
  args: {
    query: v.string(),
    limit: v.optional(v.number()),
    offset: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("User is not authenticated");

    const allJobs = await ctx.db
      .query("jobs")
      .withIndex("by_status", (q) => q.eq("status", "Active"))
      .collect();

    // Simple search implementation - can be enhanced with better search logic
    const searchTerm = args.query.toLowerCase();
    const filteredJobs = allJobs.filter(
      (job) =>
        job.title.toLowerCase().includes(searchTerm) ||
        job.company.toLowerCase().includes(searchTerm) ||
        job.description.toLowerCase().includes(searchTerm) ||
        job.location.toLowerCase().includes(searchTerm) ||
        job.skills.some((skill) => skill.toLowerCase().includes(searchTerm))
    );

    const offset = args.offset || 0;
    const limit = args.limit || 10;
    const paginatedJobs = filteredJobs.slice(offset, offset + limit);

    return {
      jobs: paginatedJobs,
      total: filteredJobs.length,
      hasMore: offset + limit < filteredJobs.length,
    };
  },
});

// Get job statistics for admin dashboard
export const getJobStats = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("User is not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user || (user.role !== "interviewer" && user.role !== "candidate")) {
      throw new Error("Only interviewers can view job statistics");
    }

    const allJobs = await ctx.db
      .query("jobs")
      .withIndex("by_posted_by", (q) => q.eq("postedBy", identity.subject))
      .collect();

    const allApplications = await ctx.db
      .query("jobApplications")
      .withIndex("by_applicant_id", (q) => q.eq("applicantId", identity.subject))
      .collect();

    const stats = {
      totalJobsPosted: allJobs.length,
      activeJobs: allJobs.filter((job) => job.status === "Active").length,
      totalApplications: allApplications.length,
      pendingApplications: allApplications.filter((app) => app.status === "Pending").length,
      shortlistedApplications: allApplications.filter((app) => app.status === "Shortlisted").length,
      hiredApplications: allApplications.filter((app) => app.status === "Hired").length,
    };

    return stats;
  },
});

// Withdraw (delete) an application by the applicant
export const withdrawApplication = mutation({
  args: { applicationId: v.id("jobApplications") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("User is not authenticated");

    const application = await ctx.db.get(args.applicationId);
    if (!application) throw new Error("Application not found");
    if (application.applicantId !== identity.subject) {
      throw new Error("You can only withdraw your own application");
    }

    // Get job details before deleting application
    const job = await ctx.db.get(application.jobId);
    
    // Decrement applicationsCount on the job
    if (job && job.applicationsCount > 0) {
      await ctx.db.patch(application.jobId, {
        applicationsCount: job.applicationsCount - 1,
      });
    }

    // Create activity notification for job poster
    if (job) {
      const applicant = await ctx.db
        .query("users")
        .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
        .first();

      await ctx.db.insert("activities", {
        type: "application_withdrawn",
        target: getTargetForType("application_withdrawn"),
        title: "Application Withdrawn",
        description: `An application has been withdrawn for the ${job.title} position at ${job.company}`,
        userId: job.postedBy,
        relatedUserId: identity.subject,
        jobId: application.jobId,
        applicationId: args.applicationId,
        metadata: {
          jobTitle: job.title,
          companyName: job.company,
          applicantName: applicant?.name || "Unknown Applicant",
          notes: "",
        },
        isRead: false,
        createdAt: Date.now(),
        emailSent: false,
      });
    }

    await ctx.db.delete(args.applicationId);
    return { success: true };
  },
});
