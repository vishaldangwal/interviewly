import React from "react";
import { motion } from "framer-motion";
import { Download, X, Mail, Phone, MapPin, Globe } from "lucide-react";

const PreviewModal = ({
  formData,
  setShowPreviewModal,
  downloadPDF,
}: {
  formData: any;
  setShowPreviewModal: (show: boolean) => void;
  downloadPDF: () => void;
}) => {
  return (
    <div>
      {" "}
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setShowPreviewModal(false)}
      >
        <motion.div
          className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-gray-200"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 z-10 flex justify-between items-center p-5 border-b bg-white/90 backdrop-blur-md">
            <h3 className="text-xl font-semibold text-gray-900">
              Resume Preview
            </h3>
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={downloadPDF}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                <Download size={18} /> Download PDF
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowPreviewModal(false)}
                className="flex items-center justify-center h-9 w-9 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200"
              >
                <X size={18} />
              </motion.button>
            </div>
          </div>
          <div className="p-8" id="resume-preview-content">
            {/* Resume Header */}
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                {formData.personal.name}
              </h1>
              <p className="text-xl text-blue-600 mb-3">
                {formData.personal.title}
              </p>
              <div className="flex justify-center items-center gap-6 text-sm text-gray-700 flex-wrap">
                {formData.personal.email && (
                  <span className="flex items-center gap-1.5">
                    <Mail size={14} /> {formData.personal.email}
                  </span>
                )}
                {formData.personal.phone && (
                  <span className="flex items-center gap-1.5">
                    <Phone size={14} /> {formData.personal.phone}
                  </span>
                )}
                {formData.personal.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin size={14} /> {formData.personal.location}
                  </span>
                )}
                {formData.personal.portfolio && (
                  <span className="flex items-center gap-1.5">
                    <Globe size={14} /> {formData.personal.portfolio}
                  </span>
                )}
              </div>
            </div>
            {/* Summary Section */}
            {formData.personal.summary && (
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-3">
                  SUMMARY
                </h2>
                <p className="text-gray-700 whitespace-pre-line">
                  {formData.personal.summary}
                </p>
              </div>
            )}
            {/* Experience Section */}
            {formData.experience &&
              formData.experience.length > 0 &&
              formData.experience.some(
                (exp) =>
                  exp.company ||
                  exp.position ||
                  exp.duration ||
                  exp.description,
              ) && (
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-3">
                    EXPERIENCE
                  </h2>
                  {formData.experience.map(
                    (exp, idx) =>
                      (exp.company ||
                        exp.position ||
                        exp.duration ||
                        exp.description) && (
                        <div key={idx} className="mb-4">
                          <div className="flex justify-between flex-wrap">
                            <h3 className="font-bold text-gray-900">
                              {exp.position}
                            </h3>
                            <span className="text-gray-600">
                              {exp.duration}
                            </span>
                          </div>
                          <p className="text-blue-600 mb-1">{exp.company}</p>
                          <p className="text-gray-700">{exp.description}</p>
                        </div>
                      ),
                  )}
                </div>
              )}
            {/* Education Section */}
            {formData.education &&
              formData.education.length > 0 &&
              formData.education.some(
                (edu) =>
                  edu.institution || edu.degree || edu.year || edu.details,
              ) && (
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-3">
                    EDUCATION
                  </h2>
                  {formData.education.map(
                    (edu, idx) =>
                      (edu.institution ||
                        edu.degree ||
                        edu.year ||
                        edu.details) && (
                        <div key={idx} className="mb-3">
                          <div className="flex justify-between flex-wrap">
                            <h3 className="font-bold text-gray-900">
                              {edu.degree}
                            </h3>
                            <span className="text-gray-600">{edu.year}</span>
                          </div>
                          <p className="text-blue-600">{edu.institution}</p>
                          {edu.details && (
                            <p className="text-gray-700">{edu.details}</p>
                          )}
                        </div>
                      ),
                  )}
                </div>
              )}
            {/* Projects Section */}
            {formData.projects &&
              formData.projects.length > 0 &&
              formData.projects.some(
                (proj) =>
                  proj.name ||
                  proj.description ||
                  proj.technologies ||
                  proj.link,
              ) && (
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-3">
                    PROJECTS
                  </h2>
                  {formData.projects.map(
                    (proj, idx) =>
                      (proj.name ||
                        proj.description ||
                        proj.technologies ||
                        proj.link) && (
                        <div key={idx} className="mb-4">
                          <div className="flex justify-between items-center flex-wrap">
                            <h3 className="font-bold text-gray-900">
                              {proj.name}
                            </h3>
                            {proj.link && (
                              <a
                                href={proj.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline text-sm"
                              >
                                {proj.link}
                              </a>
                            )}
                          </div>
                          {proj.technologies && (
                            <p className="text-xs text-blue-500 mb-1">
                              {proj.technologies}
                            </p>
                          )}
                          <p className="text-gray-700">{proj.description}</p>
                        </div>
                      ),
                  )}
                </div>
              )}
            {/* Skills Section */}
            {(formData.skills.technical.length > 0 ||
              formData.skills.languages.length > 0 ||
              (formData.certifications &&
                formData.certifications.length > 0)) && (
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-3">
                  SKILLS & MORE
                </h2>
                {formData.skills.technical.length > 0 && (
                  <div className="mb-2">
                    <h3 className="font-bold text-gray-900 mb-1 text-sm">
                      Technical Skills
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formData.skills.technical.map((skill, idx) => (
                        <span
                          key={idx}
                          className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {formData.skills.languages.length > 0 && (
                  <div className="mb-2">
                    <h3 className="font-bold text-gray-900 mb-1 text-sm">
                      Languages
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formData.skills.languages.map((lang, idx) => (
                        <span
                          key={idx}
                          className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-sm"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {formData.certifications &&
                  formData.certifications.length > 0 &&
                  formData.certifications.some((cert) => cert.name) && (
                    <div className="mb-2">
                      <h3 className="font-bold text-gray-900 mb-1 text-sm">
                        Certifications
                      </h3>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {formData.certifications
                          .filter((cert) => cert.name)
                          .map((cert, idx) => (
                            <span
                              key={idx}
                              className="bg-green-50 text-green-700 px-2 py-1 rounded text-sm"
                            >
                              {cert.name}
                              {cert.issuer ? ` (${cert.issuer})` : ""}
                              {cert.year ? `, ${cert.year}` : ""}
                            </span>
                          ))}
                      </div>
                    </div>
                  )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PreviewModal;
