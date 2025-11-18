import { X, Plus, Award, Briefcase } from "lucide-react";

const SkillsCertification = ({
  formData,
  handleInputChange,
  deleteArrayItem,
  addArrayItem,
  setFormData,
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
  setFormData: (data: any) => void;
}) => (
  <div className="space-y-6">
    <div className="space-y-6">
      {formData.certifications.map((cert, index) => (
        <div
          key={index}
          className="p-6 bg-white/5 backdrop-blur-sm border border-blue-600/30 rounded-lg space-y-4 relative"
        >
          <button
            type="button"
            className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors"
            onClick={() => deleteArrayItem("certifications", index)}
            title="Delete Certification"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <Award className="w-4 h-4" />
                Certification Name
              </label>
              <input
                type="text"
                value={cert.name}
                onChange={(e) =>
                  handleInputChange(
                    "certifications",
                    "name",
                    e.target.value,
                    index,
                  )
                }
                placeholder="AWS Certified Solutions Architect"
                className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-blue-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition-all duration-200 hover:border-blue-600/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Issuer
              </label>
              <input
                type="text"
                value={cert.issuer}
                onChange={(e) =>
                  handleInputChange(
                    "certifications",
                    "issuer",
                    e.target.value,
                    index,
                  )
                }
                placeholder="Amazon Web Services"
                className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-blue-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition-all duration-200 hover:border-blue-600/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <Award className="w-4 h-4" />
                Year
              </label>
              <input
                type="text"
                value={cert.year}
                onChange={(e) =>
                  handleInputChange(
                    "certifications",
                    "year",
                    e.target.value,
                    index,
                  )
                }
                placeholder="2023"
                className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-blue-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition-all duration-200 hover:border-blue-600/50"
              />
            </div>
          </div>
        </div>
      ))}
      <button
        onClick={() =>
          addArrayItem("certifications", { name: "", issuer: "", year: "" })
        }
        className="w-full py-3 bg-blue-600/20 border border-blue-600/40 rounded-lg text-blue-400 hover:bg-blue-600 hover:text-white transition-all duration-200 flex items-center justify-center gap-2 font-medium"
      >
        <Plus className="w-4 h-4" />
        Add Certification
      </button>
    </div>

    <div className="p-6 bg-white/5 backdrop-blur-sm border border-blue-600/30 rounded-lg">
      <h3 className="text-lg font-semibold text-white mb-4">
        Technical Skills
      </h3>
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          placeholder="Add a skill (e.g., JavaScript)"
          className="flex-1 px-4 py-2 bg-white/5 backdrop-blur-sm border border-blue-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition-all duration-200 hover:border-blue-600/50"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              const newSkill = e.currentTarget.value.trim();
              if (newSkill && !formData.skills?.technical?.includes(newSkill)) {
                const updatedSkills = [...(formData.skills?.technical || []), newSkill];
                setFormData((prev) => ({
                  ...prev,
                  skills: { 
                    ...prev.skills, 
                    technical: updatedSkills 
                  }
                }));
                e.currentTarget.value = '';
              }
            }
          }}
        />
        <button
          type="button"
          onClick={(e) => {
            const input = e.currentTarget.previousElementSibling as HTMLInputElement;
            const newSkill = input.value.trim();
            if (newSkill && !formData.skills?.technical?.includes(newSkill)) {
              const updatedSkills = [...(formData.skills?.technical || []), newSkill];
              setFormData((prev) => ({
                ...prev,
                skills: { 
                  ...prev.skills, 
                  technical: updatedSkills 
                }
              }));
              input.value = '';
            }
          }}
          className="px-4 py-2 bg-blue-600/20 border border-blue-600/40 rounded-lg text-blue-400 hover:bg-blue-600 hover:text-white transition-all duration-200 font-medium"
        >
          Add
        </button>
      </div>
      {/* <textarea
        value={(formData.skills?.technical || []).join(", ")}
        onChange={(e) => {
          const skillsArray = e.target.value.split(",").map((s) => s.trim()).filter(s => s);
          setFormData((prev) => ({
            ...prev,
            skills: { 
              ...prev.skills, 
              technical: skillsArray 
            }
          }));
        }}
        placeholder="Or type multiple skills separated by commas: JavaScript, React, Node.js, Python, AWS, Docker..."
        rows={3}
        className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-blue-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition-all duration-200 hover:border-blue-600/50 resize-none"
      /> */}
      {(formData.skills?.technical || []).length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {(formData.skills?.technical || []).map((skill, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600/20 border border-blue-600/40 rounded-full text-sm text-blue-300"
            >
              {skill}
              <button
                type="button"
                onClick={() => {
                  const updatedSkills = (formData.skills?.technical || []).filter((_, i) => i !== index);
                  setFormData((prev) => ({
                    ...prev,
                    skills: { 
                      ...prev.skills, 
                      technical: updatedSkills 
                    }
                  }));
                }}
                className="ml-1 text-blue-400 hover:text-red-400 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>

    <div className="p-6 bg-white/5 backdrop-blur-sm border border-blue-600/30 rounded-lg">
      <h3 className="text-lg font-semibold text-white mb-4">Languages</h3>
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          placeholder="Add a language (e.g., English Native)"
          className="flex-1 px-4 py-2 bg-white/5 backdrop-blur-sm border border-blue-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition-all duration-200 hover:border-blue-600/50"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              const newLanguage = e.currentTarget.value.trim();
              if (newLanguage && !formData.skills?.languages?.includes(newLanguage)) {
                const updatedLanguages = [...(formData.skills?.languages || []), newLanguage];
                setFormData((prev) => ({
                  ...prev,
                  skills: { 
                    ...prev.skills, 
                    languages: updatedLanguages 
                  }
                }));
                e.currentTarget.value = '';
              }
            }
          }}
        />
        <button
          type="button"
          onClick={(e) => {
            const input = e.currentTarget.previousElementSibling as HTMLInputElement;
            const newLanguage = input.value.trim();
            if (newLanguage && !formData.skills?.languages?.includes(newLanguage)) {
              const updatedLanguages = [...(formData.skills?.languages || []), newLanguage];
              setFormData((prev) => ({
                ...prev,
                skills: { 
                  ...prev.skills, 
                  languages: updatedLanguages 
                }
              }));
              input.value = '';
            }
          }}
          className="px-4 py-2 bg-green-600/20 border border-green-600/40 rounded-lg text-green-400 hover:bg-green-600 hover:text-white transition-all duration-200 font-medium"
        >
          Add
        </button>
        
      </div>
      {/* <textarea
        value={(formData.skills?.languages || []).join(", ")}
        onChange={(e) => {
          const languagesArray = e.target.value.split(",").map((s) => s.trim()).filter(s => s);
          setFormData((prev) => ({
            ...prev,
            skills: { 
              ...prev.skills, 
              languages: languagesArray 
            }
          }));
        }}
        placeholder="Or type multiple languages separated by commas: English (Native), Spanish (Fluent), French (Intermediate)..."
        rows={3}
        className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-blue-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition-all duration-200 hover:border-blue-600/50 resize-none"
      /> */}
      {(formData.skills?.languages || []).length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {(formData.skills?.languages || []).map((language, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-3 py-1 bg-green-600/20 border border-green-600/40 rounded-full text-sm text-green-300"
            >
              {language}
              <button
                type="button"
                onClick={() => {
                  const updatedLanguages = (formData.skills?.languages || []).filter((_, i) => i !== index);
                  setFormData((prev) => ({
                    ...prev,
                    skills: { 
                      ...prev.skills, 
                      languages: updatedLanguages 
                    }
                  }));
                }}
                className="ml-1 text-green-400 hover:text-red-400 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  </div>
);

export default SkillsCertification;
