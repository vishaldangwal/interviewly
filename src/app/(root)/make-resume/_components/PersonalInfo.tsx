import React from "react";
import { User, Briefcase, Mail, Phone, MapPin, Globe, Loader2, Sparkles } from "lucide-react";

const PersonalInfo = ({
  formData,
  handleInputChange,
  enhanceSummary,
  isEnhancing,
}: {
  formData: any;
  handleInputChange: (section: string, key: string, value: string) => void;
  enhanceSummary: () => void;
  isEnhancing: boolean;
}) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
          <User className="w-4 h-4" />
          Full Name
        </label>
        <input
          type="text"
          value={formData.personal.name}
          onChange={(e) =>
            handleInputChange("personal", "name", e.target.value)
          }
          placeholder="John Doe"
          className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-blue-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition-all duration-200 hover:border-blue-600/50"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
          <Briefcase className="w-4 h-4" />
          Professional Title
        </label>
        <input
          type="text"
          value={formData.personal.title}
          onChange={(e) =>
            handleInputChange("personal", "title", e.target.value)
          }
          placeholder="Senior Software Engineer"
          className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-blue-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition-all duration-200 hover:border-blue-600/50"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
          <Mail className="w-4 h-4" />
          Email
        </label>
        <input
          type="email"
          value={formData.personal.email}
          onChange={(e) =>
            handleInputChange("personal", "email", e.target.value)
          }
          placeholder="john.doe@email.com"
          className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-blue-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition-all duration-200 hover:border-blue-600/50"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
          <Phone className="w-4 h-4" />
          Phone
        </label>
        <input
          type="tel"
          value={formData.personal.phone}
          onChange={(e) =>
            handleInputChange("personal", "phone", e.target.value)
          }
          placeholder="+1 (555) 123-4567"
          className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-blue-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition-all duration-200 hover:border-blue-600/50"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Location
        </label>
        <input
          type="text"
          value={formData.personal.location}
          onChange={(e) =>
            handleInputChange("personal", "location", e.target.value)
          }
          placeholder="San Francisco, CA"
          className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-blue-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition-all duration-200 hover:border-blue-600/50"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
          <Globe className="w-4 h-4" />
          Portfolio/Website
        </label>
        <input
          type="text"
          value={formData.personal.portfolio}
          onChange={(e) =>
            handleInputChange("personal", "portfolio", e.target.value)
          }
          placeholder="https://johndoe.dev"
          className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-blue-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition-all duration-200 hover:border-blue-600/50"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
          <Globe className="w-4 h-4" />
          LinkedIn Profile
        </label>
        <input
          type="text"
          value={formData.personal.linkedin}
          onChange={(e) =>
            handleInputChange("personal", "linkedin", e.target.value)
          }
          placeholder="https://linkedin.com/in/yourname"
          className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-blue-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition-all duration-200 hover:border-blue-600/50"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
          <Briefcase className="w-4 h-4" />
          Target Industry
        </label>
        <input
          type="text"
          value={formData.personal.targetIndustry}
          onChange={(e) =>
            handleInputChange("personal", "targetIndustry", e.target.value)
          }
          placeholder="Technology, Finance, Healthcare"
          className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-blue-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition-all duration-200 hover:border-blue-600/50"
        />
      </div>
    </div>
    <div className="relative">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-gray-300">
          Professional Summary
        </label>
        <button
          onClick={enhanceSummary}
          disabled={isEnhancing}
          className="group relative px-4 py-2 bg-blue-600/20 border border-blue-600/40 rounded-lg text-blue-400 hover:bg-blue-600 hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-medium hover:shadow-lg hover:shadow-blue-600/25"
          title="Improve this summary using AI assistance"
        >
          {isEnhancing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          {isEnhancing ? "Enhancing..." : "Enhance with AI"}
        </button>
      </div>
      <textarea
        value={formData.personal.summary}
        onChange={(e) =>
          handleInputChange("personal", "summary", e.target.value)
        }
        placeholder="Write a compelling professional summary that highlights your key achievements and expertise..."
        rows={4}
        className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-blue-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition-all duration-200 hover:border-blue-600/50 resize-none"
      />
    </div>
  </div>
);

export default PersonalInfo;
