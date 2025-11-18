import { Briefcase, User, Award, X, Plus } from "lucide-react";

const Experience = ({
  formData,
  handleInputChange,
  deleteArrayItem,
  addArrayItem,
}: {
  formData: any;
  handleInputChange: (
    section: string,
    key: string,
    value: string,
    index?: number,
  ) => void;
  deleteArrayItem: (section: string, index: number) => void;
  addArrayItem: (section: string, item: any) => void;
}) => (
  <div className="space-y-6">
    {formData.experience.map((exp, index) => (
      <div
        key={index}
        className="p-6 bg-white/5 backdrop-blur-sm border border-blue-600/30 rounded-lg space-y-4 relative"
      >
        <button
          type="button"
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors"
          onClick={() => deleteArrayItem("experience", index)}
          title="Delete Experience"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Company
            </label>
            <input
              type="text"
              value={exp.company}
              onChange={(e) =>
                handleInputChange(
                  "experience",
                  "company",
                  e.target.value,
                  index,
                )
              }
              placeholder="Google Inc."
              className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-blue-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition-all duration-200 hover:border-blue-600/50"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <User className="w-4 h-4" />
              Position
            </label>
            <input
              type="text"
              value={exp.position}
              onChange={(e) =>
                handleInputChange(
                  "experience",
                  "position",
                  e.target.value,
                  index,
                )
              }
              placeholder="Senior Software Engineer"
              className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-blue-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition-all duration-200 hover:border-blue-600/50"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <Award className="w-4 h-4" />
              Duration
            </label>
            <input
              type="text"
              value={exp.duration}
              onChange={(e) =>
                handleInputChange(
                  "experience",
                  "duration",
                  e.target.value,
                  index,
                )
              }
              placeholder="Jan 2020 - Present"
              className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-blue-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition-all duration-200 hover:border-blue-600/50"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">
            Description
          </label>
          <textarea
            value={exp.description}
            onChange={(e) =>
              handleInputChange(
                "experience",
                "description",
                e.target.value,
                index,
              )
            }
            placeholder="Describe your responsibilities and achievements..."
            rows={3}
            className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-blue-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition-all duration-200 hover:border-blue-600/50 resize-none"
          />
        </div>
      </div>
    ))}
    <button
      onClick={() =>
        addArrayItem("experience", {
          company: "",
          position: "",
          duration: "",
          description: "",
        })
      }
      className="w-full py-3 bg-blue-600/20 border border-blue-600/40 rounded-lg text-blue-400 hover:bg-blue-600 hover:text-white transition-all duration-200 flex items-center justify-center gap-2 font-medium"
    >
      <Plus className="w-4 h-4" />
      Add Experience
    </button>
  </div>
);
export default Experience;
