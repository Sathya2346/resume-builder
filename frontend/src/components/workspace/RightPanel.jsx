import { Edit3, CheckCircle, Scissors, Download } from 'lucide-react';

const RightPanel = ({ resumeData }) => {
  const handleDownloadPdf = () => {
    window.print();
  };

  return (
    <div className="right-panel">
      <div className="preview-toolbar">
        <button onClick={handleDownloadPdf} className="export-btn">
          <Download size={16} /> Export PDF
        </button>
      </div>
      <div className="resume-canvas">
        <div className="resume-header">
          <div className="resume-name">{resumeData.name}</div>
          <div className="resume-contact">
            <span>{resumeData.email}</span> • <span>{resumeData.phone}</span>
          </div>
        </div>

        <div className="resume-section">
          <div className="resume-section-title">Summary</div>
          <div className="resume-item">
            {resumeData.summary}
            <div className="hover-menu">
              <button><Edit3 size={12} style={{marginRight: 4}}/> Make professional</button>
              <button><Scissors size={12} style={{marginRight: 4}}/> Shorten</button>
            </div>
          </div>
        </div>

        <div className="resume-section">
          <div className="resume-section-title">Experience</div>
          {resumeData.experience.map((exp) => (
            <div className="resume-item" key={exp.id}>
              <div className="resume-item-header">
                <span>{exp.company}</span>
                <span>{exp.date}</span>
              </div>
              <div className="resume-item-subheader">{exp.role}</div>
              <div style={{ position: 'relative' }}>
                 {exp.description}
                 <div className="hover-menu" style={{ right: '-120px' }}>
                    <button><CheckCircle size={12} style={{marginRight: 4}}/> Enhance Bullets</button>
                 </div>
              </div>
            </div>
          ))}
        </div>

        <div className="resume-section">
          <div className="resume-section-title">Education</div>
          {resumeData.education.map((edu) => (
            <div className="resume-item" key={edu.id}>
              <div className="resume-item-header">
                <span>{edu.institution}</span>
                <span>{edu.date}</span>
              </div>
              <div className="resume-item-subheader">{edu.degree}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RightPanel;
