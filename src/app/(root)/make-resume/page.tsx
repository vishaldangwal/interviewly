"use client";

import { motion } from "framer-motion";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  Briefcase,
  Code,
  Eye,
  FolderOpen,
  GraduationCap,
  RefreshCw,
  Sparkles,
  User,
  Wand2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import AIEnhancement from "./_components/AIEnhancement";
import Education from "./_components/Education";
import Experience from "./_components/Experience";
import PersonalInfo from "./_components/PersonalInfo";
import PreviewModal from "./_components/PreviewModal";
import Projects from "./_components/Projects";
import SkillsCertification from "./_components/SkillsCertification";

// TypeScript interfaces
interface EnhancedResumeSections {
  summary?: string;
  experience?: Array<{ description: string }>;
  education?: Array<{ details: string }>;
  projects?: Array<{ description: string }>;
}

const ResumeBuilder = () => {
  const [activeTab, setActiveTab] = useState("personal");
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isEnhancingAll, setIsEnhancingAll] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [enhancementResults, setEnhancementResults] = useState(null);
  const [formData, setFormData] = useState({
    personal: {
      name: "",
      title: "",
      email: "",
      phone: "",
      location: "",
      portfolio: "",
      linkedin: "",
      targetIndustry: "",
      summary: "",
    },
    experience: [],
    education: [],
    skills: {
      technical: [],
      languages: [],
    },
    certifications: [],
    projects: [],
  });
  useEffect(() => {
    const savedResume = localStorage.getItem("resume");
    if (savedResume) {
      setFormData(JSON.parse(savedResume));
    }
  }, []);
  const tabs = [
    { id: "personal", label: "Personal Info", icon: User },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "education", label: "Education", icon: GraduationCap },
    {
      id: "skills_certification",
      label: "Skills & Certifications",
      icon: Code,
    },
    { id: "projects", label: "Projects", icon: FolderOpen },
    { id: "ai-enhancement", label: "AI Enhancement", icon: Sparkles },
  ];

  const handleInputChange = (section, field, value, index = null) => {
    setFormData((prev) => {
      if (index !== null) {
        const newArray = [...prev[section]];
        newArray[index] = { ...newArray[index], [field]: value };
        return { ...prev, [section]: newArray };
      } else {
        return {
          ...prev,
          [section]: { ...prev[section], [field]: value },
        };
      }
    });
  };

  const addArrayItem = (section, template) => {
    setFormData((prev) => ({
      ...prev,
      [section]: [...prev[section], template],
    }));
  };

  const deleteArrayItem = (section, index) => {
    setFormData((prev) => {
      const newArray = [...prev[section]];
      newArray.splice(index, 1);
      return { ...prev, [section]: newArray };
    });
  };

  const enhanceSummary = async () => {
    if (!formData.personal.summary.trim()) {
      toast.error("Please add a summary first");
      return;
    }

    setIsEnhancing(true);
    try {
      const response = await fetch("/api/enhance-resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resume_content: formData.personal.summary,
          target_role: formData.personal.title,
          target_industry: formData.personal.targetIndustry,
        }),
      });

      const data = await response.json();

      if (data.error) {
        toast.error(data.error);
        return;
      }

      handleInputChange("personal", "summary", data.enhanced_content);
      toast.success("Summary enhanced successfully!");

      // Store enhancement results for display
      setEnhancementResults({
        improvements_made: data.improvements_made,
        suggestions: data.suggestions,
        word_count: data.word_count,
        readability_score: data.readability_score,
        type: "summary",
      });

      // Show improvements in console for debugging
      console.log("Improvements made:", data.improvements_made);
      console.log("Suggestions:", data.suggestions);
    } catch (error) {
      console.error("Error enhancing summary:", error);
      toast.error("Failed to enhance summary");
    } finally {
      setIsEnhancing(false);
    }
  };

  const enhanceEntireResume = async () => {
    // Convert form data to a text format for enhancement
    const resumeText = `
PERSONAL SUMMARY
${formData.personal.summary}

EXPERIENCE
${formData.experience
  .map(
    (exp) => `
${exp.position} at ${exp.company}
Duration: ${exp.duration}
${exp.description}
`,
  )
  .join("\n")}

EDUCATION
${formData.education
  .map(
    (edu) => `
${edu.degree} from ${edu.institution}
Year: ${edu.year}
${edu.details || ""}
`,
  )
  .join("\n")}

SKILLS
Technical: ${formData.skills.technical.join(", ")}
Languages: ${formData.skills.languages.join(", ")}

CERTIFICATIONS
${formData.certifications
  .map(
    (cert) => `
${cert.name} - ${cert.issuer} (${cert.year})
`,
  )
  .join("\n")}

PROJECTS
${formData.projects
  .map(
    (proj) => `
${proj.name}
${proj.description}
Technologies: ${proj.technologies}
${proj.link ? `Link: ${proj.link}` : ""}
`,
  )
  .join("\n")}
    `.trim();

    if (!resumeText.trim()) {
      toast.error("Please add some content to your resume first");
      return;
    }

    setIsEnhancingAll(true);
    setIsEnhancing(true); // disables summary enhance too

    try {
      const response = await fetch("/api/enhance-resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resume_content: resumeText,
          target_role: formData.personal.title,
          target_industry: formData.personal.targetIndustry,
        }),
      });

      const data = await response.json();

      if (data.error) {
        toast.error(data.error);
        return;
      }

      // Parse the enhanced content and update form data
      const enhancedContent = data.enhanced_content;

      // Try to parse sections from the enhanced content
      try {
        const sections = parseEnhancedResume(enhancedContent);

        // Update each section if we can parse it
        if (sections.summary) {
          handleInputChange("personal", "summary", sections.summary);
        }

        if (sections.experience && sections.experience.length > 0) {
          // Update experience entries
          sections.experience.forEach((exp, index) => {
            if (formData.experience[index]) {
              if (exp.description) {
                handleInputChange(
                  "experience",
                  "description",
                  exp.description,
                  index,
                );
              }
            }
          });
        }

        if (sections.education && sections.education.length > 0) {
          // Update education entries
          sections.education.forEach((edu, index) => {
            if (formData.education[index]) {
              if (edu.details) {
                handleInputChange("education", "details", edu.details, index);
              }
            }
          });
        }

        if (sections.projects && sections.projects.length > 0) {
          // Update project descriptions
          sections.projects.forEach((proj, index) => {
            if (formData.projects[index]) {
              if (proj.description) {
                handleInputChange(
                  "projects",
                  "description",
                  proj.description,
                  index,
                );
              }
            }
          });
        }
      } catch (parseError) {
        console.warn(
          "Could not parse enhanced content, updating summary only:",
          parseError,
        );
        // Fallback: just update the summary
        handleInputChange("personal", "summary", enhancedContent);
      }

      toast.success("Resume enhanced with AI! Check the improvements.");

      // Store enhancement results for display
      setEnhancementResults({
        improvements_made: data.improvements_made,
        suggestions: data.suggestions,
        word_count: data.word_count,
        readability_score: data.readability_score,
        type: "full",
      });

      // Show improvements in console for debugging
      console.log("Improvements made:", data.improvements_made);
      console.log("Suggestions:", data.suggestions);
      console.log("Word count:", data.word_count);
      console.log("Readability score:", data.readability_score);
    } catch (error) {
      console.error("Error enhancing resume:", error);
      toast.error("Failed to enhance resume");
    } finally {
      setIsEnhancingAll(false);
      setIsEnhancing(false);
    }
  };

  // Helper function to parse enhanced resume content
  const parseEnhancedResume = (content: string) => {
    const sections: EnhancedResumeSections = {};

    // Extract summary
    const summaryMatch = content.match(
      /PERSONAL SUMMARY\s*\n([\s\S]*?)(?=\n\w+:|$)/i,
    );
    if (summaryMatch) {
      sections.summary = summaryMatch[1].trim();
    }

    // Extract experience
    const experienceMatch = content.match(
      /EXPERIENCE\s*\n([\s\S]*?)(?=\n\w+:|$)/i,
    );
    if (experienceMatch) {
      const experienceText = experienceMatch[1];
      const experienceEntries = experienceText
        .split(/(?=\w+ at \w+)/)
        .filter((entry) => entry.trim());
      sections.experience = experienceEntries.map((entry) => {
        const descriptionMatch = entry.match(/(?:.*\n){2,}([\s\S]*)/);
        return {
          description: descriptionMatch
            ? descriptionMatch[1].trim()
            : entry.trim(),
        };
      });
    }

    // Extract education
    const educationMatch = content.match(
      /EDUCATION\s*\n([\s\S]*?)(?=\n\w+:|$)/i,
    );
    if (educationMatch) {
      const educationText = educationMatch[1];
      const educationEntries = educationText
        .split(/(?=\w+ from \w+)/)
        .filter((entry) => entry.trim());
      sections.education = educationEntries.map((entry) => {
        const detailsMatch = entry.match(/(?:.*\n){2,}([\s\S]*)/);
        return {
          details: detailsMatch ? detailsMatch[1].trim() : entry.trim(),
        };
      });
    }

    // Extract projects
    const projectsMatch = content.match(/PROJECTS\s*\n([\s\S]*?)(?=\n\w+:|$)/i);
    if (projectsMatch) {
      const projectsText = projectsMatch[1];
      const projectEntries = projectsText
        .split(/(?=\n\w+\n)/)
        .filter((entry) => entry.trim());
      sections.projects = projectEntries.map((entry) => {
        const descriptionMatch = entry.match(
          /(?:.*\n){1,}([\s\S]*?)(?=\nTechnologies:|$)/,
        );
        return {
          description: descriptionMatch
            ? descriptionMatch[1].trim()
            : entry.trim(),
        };
      });
    }

    return sections;
  };

  const downloadPDF = () => {
    const element = document.getElementById("resume-preview-content");
    setShowPreviewModal(false);

    html2canvas(element).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);
      const imgX = (pageWidth - imgWidth * ratio) / 2;
      const imgY = 30;

      pdf.addImage(
        imgData,
        "PNG",
        imgX,
        imgY,
        imgWidth * ratio,
        imgHeight * ratio,
      );
      pdf.save(`${formData.personal.name.replace(/\s+/g, "_")}_Resume.pdf`);
      toast.success("Resume Downloaded Successfully");
    });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "personal":
        return (
          <PersonalInfo
            formData={formData}
            handleInputChange={handleInputChange}
            enhanceSummary={enhanceSummary}
            isEnhancing={isEnhancing}
          />
        );
      case "experience":
        return (
          <Experience
            formData={formData}
            handleInputChange={handleInputChange}
            deleteArrayItem={deleteArrayItem}
            addArrayItem={addArrayItem}
          />
        );
      case "education":
        return (
          <Education
            formData={formData}
            handleInputChange={handleInputChange}
            deleteArrayItem={deleteArrayItem}
            addArrayItem={addArrayItem}
          />
        );
      case "skills_certification":
        return (
          <SkillsCertification
            formData={formData}
            handleInputChange={handleInputChange}
            deleteArrayItem={deleteArrayItem}
            addArrayItem={addArrayItem}
            setFormData={setFormData}
          />
        );
      case "projects":
        return (
          <Projects
            formData={formData}
            handleInputChange={handleInputChange}
            deleteArrayItem={deleteArrayItem}
            addArrayItem={addArrayItem}
          />
        );
      case "ai-enhancement":
        return (
          <AIEnhancement
            enhanceSummary={enhanceSummary}
            enhanceEntireResume={enhanceEntireResume}
            isEnhancing={isEnhancing}
            isEnhancingAll={isEnhancingAll}
            enhancementResults={enhancementResults}
          />
        );
      default:
        return (
          <PersonalInfo
            formData={formData}
            handleInputChange={handleInputChange}
            enhanceSummary={enhanceSummary}
            isEnhancing={isEnhancing}
          />
        );
    }
  };

  return (
    <div className="min-h-screen mt-20 bg-black text-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="relative flex flex-col items-center justify-center mb-12 mt-4">
          {/* Premium Badge */}
          <motion.div
            className="inline-flex items-center gap-3 bg-black/80 border border-blue-600/40 rounded-full px-6 py-3 mb-6 backdrop-blur-xl shadow-lg shadow-blue-600/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            <div className="relative">
              <Sparkles size={18} className="text-blue-400" />
              <div className="absolute inset-0 animate-ping">
                <Sparkles size={18} className="text-blue-400 opacity-20" />
              </div>
            </div>
            <span className="text-sm text-blue-300 font-semibold tracking-wide">
              AI-Powered Resume Builder
            </span>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
          </motion.div>

          {/* Premium Title */}
          <motion.h1
            className="text-4xl md:text-7xl font-black bg-gradient-to-r from-white via-blue-400 to-blue-600 bg-clip-text text-transparent mb-4 leading-tight tracking-tight text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Create Your{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
              Professional Resume
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-lg md:text-xl text-blue-300 mb-2 leading-relaxed max-w-2xl text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Build a stunning, AI-enhanced resume in minutes. Stand out with
            modern design and smart content suggestions.
          </motion.p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-4 mb-10 border-b border-blue-600/30 justify-center items-center">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-7 py-3 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 text-base
                  ${
                    isActive
                      ? "bg-gradient-to-r from-blue-700 via-blue-500 to-blue-400 text-white shadow-xl shadow-blue-500/30 border-b-4 border-blue-400 z-10 scale-105"
                      : "text-blue-300 hover:text-white hover:bg-blue-600/20 hover:shadow-md hover:shadow-blue-400/10"
                  }
                `}
                whileHover={{
                  scale: isActive ? 1.08 : 1.05,
                  boxShadow: isActive
                    ? "0 8px 32px 0 rgba(0, 123, 255, 0.25)"
                    : "0 2px 8px 0 rgba(59, 130, 246, 0.10)",
                  backgroundColor: isActive
                    ? undefined
                    : "rgba(37, 99, 235, 0.10)",
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon className="w-5 h-5" />
                <span className="hidden sm:inline text-base">{tab.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="tab-glow"
                    className="absolute inset-0 rounded-xl bg-blue-400/10 pointer-events-none"
                    style={{ zIndex: -1 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="bg-black/50 backdrop-blur-sm rounded-lg p-6 mt-10 border border-blue-600/20">
          {renderTabContent()}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8 justify-center flex-wrap">
          <motion.button
            onClick={enhanceEntireResume}
            disabled={isEnhancingAll}
            whileHover={{
              scale: 1.05,
              rotate: [0, -1, 1, 0],
              boxShadow: "0 0 30px rgba(59, 130, 246, 0.6)",
            }}
            whileTap={{ scale: 0.95 }}
            animate={{
              backgroundPosition: isEnhancingAll ? "200% 0%" : "0% 0%",
            }}
            transition={{
              rotate: { duration: 0.6, ease: "easeInOut" },
              backgroundPosition: {
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              },
            }}
            className={`relative overflow-hidden flex items-center gap-2 px-6 py-3 rounded-lg font-semibold bg-gradient-to-r from-black via-gray-900 to-black text-blue-400 shadow-lg transition-all duration-300 border-2 border-blue-500/50 hover:border-blue-400 hover:text-blue-300 hover:shadow-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-black ${isEnhancingAll ? "opacity-70 cursor-not-allowed" : ""}`}
            style={{
              backgroundImage: isEnhancingAll
                ? "linear-gradient(45deg, #000000, #1f2937, #3b82f6, #1f2937, #000000)"
                : undefined,
              backgroundSize: isEnhancingAll ? "200% 100%" : undefined,
            }}
            title="Enhance your entire resume with AI"
          >
            <motion.div
              animate={isEnhancingAll ? { rotate: 360 } : {}}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              {isEnhancingAll ? (
                <RefreshCw className="w-5 h-5" />
              ) : (
                <Wand2 className="w-5 h-5" />
              )}
            </motion.div>
            <span className="relative z-10">
              {isEnhancingAll
                ? "Enhancing All..."
                : "Enhance Entire Resume with AI"}
            </span>
            {/* Animated background glow */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-blue-400/20 to-blue-600/20 opacity-0"
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>

          <motion.button
            onClick={() => setShowPreviewModal(true)}
            whileHover={{
              scale: 1.03,
              y: -2,
              boxShadow: "0 10px 25px rgba(59, 130, 246, 0.4)",
            }}
            whileTap={{ scale: 0.97 }}
            className="relative overflow-hidden px-6 py-3 bg-black text-blue-400 rounded-lg border-2 border-blue-500/50 hover:border-blue-400 hover:text-blue-300 transition-all duration-300 font-medium flex items-center gap-2 group"
          >
            <motion.div
              whileHover={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 0.5 }}
            >
              <Eye className="w-4 h-4" />
            </motion.div>
            <span>Preview Resume</span>
            {/* Sliding background effect */}
            <motion.div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-blue-400/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />
          </motion.button>

          <motion.button
            className="relative overflow-hidden px-6 py-3 bg-black text-blue-400 border-2 border-blue-600/50 rounded-lg hover:border-blue-400 hover:text-blue-300 transition-all duration-300 font-medium group"
            onClick={() => {
              localStorage.setItem("resume", JSON.stringify(formData));
              toast.success("Draft Saved Successfully");
            }}
            whileHover={{
              scale: 1.03,
              boxShadow: "0 8px 20px rgba(59, 130, 246, 0.3)",
            }}
            whileTap={{ scale: 0.97 }}
          >
            <motion.span
              className="relative z-10"
              whileHover={{ y: -1 }}
              transition={{ duration: 0.2 }}
            >
              Save Draft
            </motion.span>
            {/* Pulsing background effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-blue-400/20 to-blue-600/20 opacity-0"
              animate={{
                opacity: [0, 0.3, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.button>
        </div>
        {showPreviewModal && (
          <PreviewModal
            formData={formData}
            setShowPreviewModal={setShowPreviewModal}
            downloadPDF={downloadPDF}
          />
        )}
      </div>
    </div>
  );
};

export default ResumeBuilder;
