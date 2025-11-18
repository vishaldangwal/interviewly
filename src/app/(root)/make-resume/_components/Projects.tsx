import { X, Plus, FolderOpen, Code, Globe } from "lucide-react";

const Projects = ({
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
    {formData.projects.map((project, index) => (
      <div
        key={index}
        className="p-6 bg-white/5 backdrop-blur-sm border border-blue-600/30 rounded-lg space-y-4 relative"
      >
        <button
          type="button"
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors"
          onClick={() => deleteArrayItem("projects", index)}
          title="Delete Project"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <FolderOpen className="w-4 h-4" />
              Project Name
            </label>
            <input
              type="text"
              value={project.name}
              onChange={(e) =>
                handleInputChange("projects", "name", e.target.value, index)
              }
              placeholder="E-commerce Platform"
              className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-blue-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition-all duration-200 hover:border-blue-600/50"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <Code className="w-4 h-4" />
              Technologies
            </label>
            <input
              type="text"
              value={project.technologies}
              onChange={(e) =>
                handleInputChange(
                  "projects",
                  "technologies",
                  e.target.value,
                  index,
                )
              }
              placeholder="React, Node.js, MongoDB"
              className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-blue-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition-all duration-200 hover:border-blue-600/50"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Link
            </label>
            <input
              type="text"
              value={project.link}
              onChange={(e) =>
                handleInputChange("projects", "link", e.target.value, index)
              }
              placeholder="https://github.com/username/project"
              className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-blue-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition-all duration-200 hover:border-blue-600/50"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">
            Description
          </label>
          <textarea
            value={project.description}
            onChange={(e) =>
              handleInputChange(
                "projects",
                "description",
                e.target.value,
                index,
              )
            }
            placeholder="Describe the project, your role, and key achievements..."
            rows={3}
            className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-blue-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition-all duration-200 hover:border-blue-600/50 resize-none"
          />
        </div>
      </div>
    ))}
    <button
      onClick={() =>
        addArrayItem("projects", {
          name: "",
          description: "",
          technologies: "",
          link: "",
        })
      }
      className="w-full py-3 bg-blue-600/20 border border-blue-600/40 rounded-lg text-blue-400 hover:bg-blue-600 hover:text-white transition-all duration-200 flex items-center justify-center gap-2 font-medium"
    >
      <Plus className="w-4 h-4" />
      Add Project
    </button>
  </div>
);

export default Projects;
