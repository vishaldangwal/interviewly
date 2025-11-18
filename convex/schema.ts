import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { title } from "process";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    image: v.optional(v.string()),
    role: v.union(v.literal("candidate"), v.literal("interviewer")),
    clerkId: v.string(),
  }).index("by_clerk_id", ["clerkId"]),

  interviews: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    startTime: v.number(),
    endTime: v.optional(v.number()),
    status: v.string(),
    streamCallId: v.string(),
    candidateId: v.string(),
    interviewerIds: v.array(v.string()),
    questions: v.array(v.string()),
  })
    .index("by_candidate_id", ["candidateId"])
    .index("by_stream_id", ["streamCallId"])
    .index("by_status", ["status"])
    .index("by_status_and_time", ["status", "startTime"]),

  comments: defineTable({
    content: v.string(),
    rating: v.number(),
    interviewerId: v.string(),
    interviewId: v.id("interviews"),
  }).index("by_interview_id", ["interviewId"]),

  questions: defineTable({
    q_id: v.string(),
    number: v.number(),
    title: v.string(),
    description: v.string(),
    difficulty: v.union(
      v.literal("Easy"),
      v.literal("Medium"),
      v.literal("Hard"),
    ),
    examples: v.array(
      v.object({
        input: v.string(),
        output: v.string(),
        explanation: v.optional(v.string()),
      }),
    ),
    constraints: v.array(v.string()),
    starterCode: v.array(
      v.object({
        lang: v.string(),
        code: v.string(),
      }),
    ),
  }).index("by_qid", ["q_id", "number"]),

  
  flashcards: defineTable({
    user: v.string(),
    categories: v.optional(v.array(v.string())),
    flashcards: v.optional(
      v.array(
        v.object({
          title: v.string(),
          question: v.string(),
          answer: v.string(),
          category: v.string(),
        }),
      ),
    ),
  }).index("by_user", ["user"]),

  quizzes: defineTable({
    userId: v.string(),
    quizId: v.string(),
    title: v.string(),
    category: v.string(),
    description: v.string(),
    totalQuestions: v.number(),
    badges: v.array(v.string()),
    totalTime: v.number(),
    questions: v.array(
      v.object({
        question: v.string(),
        options: v.array(v.string()),
        correct: v.number(),
      }),
    ),

    strongAreas: v.array(v.string()),
    weakAreas: v.array(v.string()),
    attempts: v.number(),

    attemptsHistory: v.array(
      v.object({
        attemptId: v.number(),
        completedOn: v.string(),
        score: v.number(),
        correctAnswers: v.number(),
        incorrectAnswers: v.number(),
        skippedAnswers: v.number(),
        timeSpent: v.string(),
        questions: v.array(
          v.object({
            id: v.string(),
            question: v.string(),
            yourAnswer: v.string(),
            correctAnswer: v.string(),
            isCorrect: v.boolean(),
            timeSpent: v.string(),
          }),
        ),
      }),
    ),

    recommendedResources: v.array(
      v.object({
        title: v.string(),
        type: v.string(),
        url: v.string(),
      }),
    ),
  })
    .index("by_userId", ["userId"])
    .index("by_quizId", ["quizId"]),

  jobs: defineTable({
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
    postedBy: v.string(), // clerkId of the admin/interviewer
    status: v.union(
      v.literal("Active"),
      v.literal("Closed"),
      v.literal("Draft")
    ),
    postedAt: v.number(),
    deadline: v.optional(v.number()),
    applicationsCount: v.number(),
  })
    .index("by_posted_by", ["postedBy"])
    .index("by_status", ["status"])
    .index("by_type", ["type"])
    .index("by_experience_level", ["experienceLevel"])
    .index("by_posted_at", ["postedAt"]),

  jobApplications: defineTable({
    jobId: v.id("jobs"),
    applicantId: v.string(), // clerkId of the applicant
    coverLetter: v.string(),
    resume: v.optional(v.string()), // URL to resume file
    status: v.union(
      v.literal("Pending"),
      v.literal("Under Review"),
      v.literal("Shortlisted"),
      v.literal("Rejected"),
      v.literal("Hired")
    ),
    appliedAt: v.number(),
    reviewedAt: v.optional(v.number()),
    reviewedBy: v.optional(v.string()), // clerkId of the reviewer
    notes: v.optional(v.string()),
  })
    .index("by_job_id", ["jobId"])
    .index("by_applicant_id", ["applicantId"])
    .index("by_status", ["status"])
    .index("by_applied_at", ["appliedAt"]),

  // New activities table for notifications
  activities: defineTable({
    type: v.union(
      v.literal("application_submitted"),
      v.literal("application_reviewed"),
      v.literal("application_shortlisted"),
      v.literal("application_rejected"),
      v.literal("application_hired"),
      v.literal("application_withdrawn"),
      v.literal("job_posted"),
      v.literal("job_closed"),
      v.literal("meeting_scheduled")
    ),
    target: v.union(v.literal("user"), v.literal("admin")),
    title: v.string(),
    description: v.string(),
    userId: v.string(), // clerkId of the user who should see this activity
    relatedUserId: v.optional(v.string()), // clerkId of the user who triggered this activity
    jobId: v.optional(v.id("jobs")),
    applicationId: v.optional(v.id("jobApplications")),
    metadata: v.optional(v.object({
      jobTitle: v.optional(v.string()),
      companyName: v.optional(v.string()),
      applicantName: v.optional(v.string()),
      oldStatus: v.optional(v.string()),
      newStatus: v.optional(v.string()),
      notes: v.optional(v.string()),
    })),
    isRead: v.boolean(),
    createdAt: v.number(),
    emailSent: v.boolean(),
  })
    .index("by_user_id", ["userId"])
    .index("by_type", ["type"])
    .index("by_created_at", ["createdAt"])
    .index("by_is_read", ["isRead"])
    .index("by_job_id", ["jobId"])
    .index("by_application_id", ["applicationId"]),

  // Study plans table for storing user study plans
  studyPlans: defineTable({
    userId: v.string(), // clerkId of the user
    jobTitle: v.string(),
    companyName: v.string(),
    jobLevel: v.string(),
    userSkills: v.array(v.string()),
    requiredSkills: v.array(v.string()),
    prepDays: v.number(),
    hoursPerDay: v.number(),
    studyPlan: v.array(
      v.object({
        day: v.number(),
        topics: v.optional(
          v.array(
            v.object({
              topic: v.string(),
              hours_allocated: v.number(),
              focus_area: v.string(),
              notes: v.optional(v.string()),
            })
          )
        ),
        notes: v.optional(v.string()),
      })
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user_id", ["userId"])
    .index("by_created_at", ["createdAt"])
    .index("by_updated_at", ["updatedAt"]),
});
