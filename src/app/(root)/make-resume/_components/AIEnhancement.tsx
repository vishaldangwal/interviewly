import React from "react";
import { Sparkles, RefreshCw, Wand2, Lightbulb, CheckCircle } from "lucide-react";

const AIEnhancement = ({
  enhanceSummary,
  enhanceEntireResume,
  isEnhancing,
  isEnhancingAll,
  enhancementResults,
}: {
  enhanceSummary: () => void;
  enhanceEntireResume: () => void;
  isEnhancing: boolean;
  isEnhancingAll: boolean;
  enhancementResults: any;
}) => (
  <div className="space-y-8">
    <div className="text-center">
      <h3 className="text-2xl font-bold text-blue-400 flex items-center justify-center gap-3 mb-4">
        <Sparkles className="w-6 h-6" />
        AI-Powered Resume Enhancement
      </h3>
      <p className="text-gray-300 max-w-2xl mx-auto">
        Use advanced AI to improve your resume content, make it more
        compelling, and optimize it for Applicant Tracking Systems (ATS).
      </p>
    </div>

    {/* Enhancement Options */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Summary Enhancement */}
      <div className="p-6 bg-white/5 backdrop-blur-sm border border-blue-600/30 rounded-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-600/20 rounded-lg">
            <Sparkles className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white">
              Summary Enhancement
            </h4>
            <p className="text-sm text-gray-400">
              Improve your professional summary
            </p>
          </div>
        </div>
        <p className="text-sm text-gray-300 mb-4">
          Transform your summary with stronger action verbs, better structure,
          and more impactful language.
        </p>
        <button
          onClick={enhanceSummary}
          disabled={isEnhancing}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600/20 border border-blue-600/40 rounded-lg text-blue-400 hover:bg-blue-600 hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {isEnhancing ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          {isEnhancing ? "Enhancing..." : "Enhance Summary"}
        </button>
      </div>

      {/* Full Resume Enhancement */}
      <div className="p-6 bg-white/5 backdrop-blur-sm border border-blue-600/30 rounded-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-600/20 rounded-lg">
            <Wand2 className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white">
              Full Resume Enhancement
            </h4>
            <p className="text-sm text-gray-400">
              Enhance your entire resume
            </p>
          </div>
        </div>
        <p className="text-sm text-gray-300 mb-4">
          Get comprehensive improvements across all sections with ATS
          optimization and professional language.
        </p>
        <button
          onClick={enhanceEntireResume}
          disabled={isEnhancingAll}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600/20 border border-green-600/40 rounded-lg text-green-400 hover:bg-green-600 hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {isEnhancingAll ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Wand2 className="w-4 h-4" />
          )}
          {isEnhancingAll ? "Enhancing..." : "Enhance Full Resume"}
        </button>
      </div>
    </div>

    {/* Features List */}
    <div className="p-6 bg-white/5 backdrop-blur-sm border border-blue-600/30 rounded-lg">
      <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-blue-400" />
        What AI Enhancement Includes
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
          <div>
            <h5 className="text-sm font-medium text-white">
              Strong Action Verbs
            </h5>
            <p className="text-xs text-gray-400">
              Replace weak verbs with impactful alternatives
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
          <div>
            <h5 className="text-sm font-medium text-white">
              ATS Optimization
            </h5>
            <p className="text-xs text-gray-400">
              Improve keyword matching and readability
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
          <div>
            <h5 className="text-sm font-medium text-white">
              Professional Language
            </h5>
            <p className="text-xs text-gray-400">
              Use industry-standard terminology
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
          <div>
            <h5 className="text-sm font-medium text-white">
              Content Structure
            </h5>
            <p className="text-xs text-gray-400">
              Improve clarity and eliminate redundancy
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
          <div>
            <h5 className="text-sm font-medium text-white">
              Quantifiable Achievements
            </h5>
            <p className="text-xs text-gray-400">
              Add metrics and measurable results
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
          <div>
            <h5 className="text-sm font-medium text-white">
              Grammar & Spelling
            </h5>
            <p className="text-xs text-gray-400">
              Ensure perfect language and punctuation
            </p>
          </div>
        </div>
      </div>
    </div>

    {/* Tips */}
    <div className="p-6 bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-600/30 rounded-lg">
      <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
        <Lightbulb className="w-5 h-5 text-yellow-400" />
        Pro Tips for Best Results
      </h4>
      <div className="space-y-2 text-sm text-gray-300">
        <p>
          • Add specific details about your achievements and responsibilities
        </p>
        <p>• Include relevant keywords from the job description</p>
        <p>
          • Keep your content honest and authentic - AI enhances, doesn't
          fabricate
        </p>
        <p>• Review and customize the enhanced content to match your voice</p>
        <p>
          • Use the enhancement as a starting point, then personalize further
        </p>
      </div>
    </div>

    {/* Enhancement Results */}
    {enhancementResults && (
      <div className="p-6 bg-gradient-to-r from-green-600/10 to-blue-600/10 border border-green-600/30 rounded-lg">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-400" />
          Last Enhancement Results
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div className="space-y-2">
            <h5 className="text-sm font-medium text-white">Word Count</h5>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-400">
                Original: {enhancementResults.word_count.original}
              </span>
              <span className="text-green-400">→</span>
              <span className="text-white">
                {enhancementResults.word_count.enhanced}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <h5 className="text-sm font-medium text-white">
              Readability Score
            </h5>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-400">
                Original: {enhancementResults.readability_score.original}/10
              </span>
              <span className="text-green-400">→</span>
              <span className="text-white">
                {enhancementResults.readability_score.enhanced}/10
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h5 className="text-sm font-medium text-white mb-2">
              Improvements Made:
            </h5>
            <ul className="space-y-1">
              {enhancementResults.improvements_made.map(
                (improvement, index) => (
                  <li
                    key={index}
                    className="text-sm text-gray-300 flex items-start gap-2"
                  >
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></span>
                    {improvement}
                  </li>
                ),
              )}
            </ul>
          </div>

          <div>
            <h5 className="text-sm font-medium text-white mb-2">
              Suggestions:
            </h5>
            <ul className="space-y-1">
              {enhancementResults.suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="text-sm text-gray-300 flex items-start gap-2"
                >
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    )}
  </div>
);

export default AIEnhancement;
