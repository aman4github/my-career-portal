import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Download, Type, Briefcase, Sparkles,
  Loader2, Trash2, Plus, ArrowLeft, Mail,
  Phone, MapPin, Award, X, GraduationCap, Layout,
  Github, Linkedin, Globe, FolderKanban, BadgeCheck
} from 'lucide-react';
import OpenAI from 'openai';
import Swal from 'sweetalert2';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENROUTER_API_KEY,
  dangerouslyAllowBrowser: true
});

const ResumeMaker = () => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [activeTemplate, setActiveTemplate] = useState("Modern");

  useEffect(() => {

    const userData = JSON.parse(
      localStorage.getItem("user")
    );

    // NOT LOGGED IN
    if (!userData) {

      navigate("/");

    }

  }, [navigate]);

  const templates = {
    Modern: { accent: "#4f46e5", secondary: "#f8fafc", alignment: "left" },
    Creative: { accent: "#ec4899", secondary: "#fff1f2", alignment: "center" },
    Minimalist: { accent: "#0f172a", secondary: "#f1f5f9", alignment: "left" }
  };

  const [resumeData, setResumeData] = useState({
    name: "Alex Johnson",
    role: "Senior Full Stack Developer",
    email: "alex.johnson@email.com",
    phone: "(555) 123-4567",
    location: "San Francisco, CA",
    github: "github.com/alexj",
    linkedin: "linkedin.com/in/alexj",
    portfolio: "alexj.dev",
    summary: "Results-driven Full Stack Developer with 7+ years of experience building scalable web applications. Expert in React, Node.js, and cloud technologies.",
    skills: ["React", "Node.js", "TypeScript", "AWS", "Tailwind CSS"],
    experience: [
      { id: 1, company: "Tech Innovations Inc.", role: "Senior Developer", duration: "2020 - Present", desc: "Led a team of 5 developers to build a high-traffic e-commerce platform using React and AWS." }
    ],
    projects: [
      { id: 1, title: "AI Career Portal", tech: "React, OpenAI", link: "smartcareer.app", desc: "Built an end-to-end career platform with AI resume analysis." }
    ],
    education: [
      { id: 1, school: "University of California, Berkeley", degree: "B.S. Computer Science", year: "2013 - 2017" }
    ],
    certifications: [
      { id: 1, name: "AWS Certified Developer", issuer: "Amazon Web Services", date: "2023" }
    ]
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setResumeData(prev => ({ ...prev, [name]: value }));
  };

  const handleSkillAdd = (e) => {
    if (e.key === 'Enter' && skillInput.trim() !== "") {
      e.preventDefault();
      if (!resumeData.skills.includes(skillInput.trim())) {
        setResumeData(prev => ({ ...prev, skills: [...prev.skills, skillInput.trim()] }));
      }
      setSkillInput("");
    }
  };

  const removeSkill = (skill) => setResumeData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));

  const addSectionItem = (section) => {
    let newItem = { id: Date.now() };
    if (section === 'experience') newItem = { ...newItem, company: "", role: "", duration: "", desc: "" };
    else if (section === 'education') newItem = { ...newItem, school: "", degree: "", year: "" };
    else if (section === 'projects') newItem = { ...newItem, title: "", tech: "", link: "", desc: "" };
    else if (section === 'certifications') newItem = { ...newItem, name: "", issuer: "", date: "" };

    setResumeData(prev => ({ ...prev, [section]: [...prev[section], newItem] }));
  };

  const updateSectionItem = (section, id, field, value) => {
    const updated = resumeData[section].map(item => item.id === id ? { ...item, [field]: value } : item);
    setResumeData(prev => ({ ...prev, [section]: updated }));
  };

  const removeSectionItem = (section, id) => {
    setResumeData(prev => ({ ...prev, [section]: prev[section].filter(item => item.id !== id) }));
  };

  const generateAISummary = async () => {
    if (!resumeData.role) return alert("Enter a role first");
    setIsGenerating(true);
    try {
      const completion = await openai.chat.completions.create({
        messages: [{ role: "user", content: `Write a 3-line professional resume bio for a ${resumeData.role} skilled in ${resumeData.skills.join(", ")}` }],
        model: "gpt-4o-mini",
      });
      setResumeData(prev => ({ ...prev, summary: completion.choices[0].message.content }));
    } finally { setIsGenerating(false); }
  };

  const handlePrint = () => {
    const content = document.getElementById('resume-preview').innerHTML;
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    const win = iframe.contentWindow;
    win.document.write(`
      <html>
        <head>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
            body { font-family: 'Inter', sans-serif; }
            * { letter-spacing: 0px !important; -webkit-print-color-adjust: exact !important; }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          <div style="padding: 15mm; width: 210mm; margin: auto;">${content}</div>
        </body>
      </html>
    `);
    win.document.close();
    setTimeout(() => document.body.removeChild(iframe), 1000);
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] rounded-[2.5rem] w-full text-slate-900 overflow-hidden">

      {/* EDITOR SIDE */}
      <div className="w-1/2 p-8 overflow-y-auto h-screen border-r border-slate-200 scrollbar-hide">
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold">
            <ArrowLeft size={20} /> Dashboard
          </button>
          <button onClick={handlePrint} className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-black flex items-center gap-2 shadow-lg">
            <Download size={18} /> Download PDF
          </button>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm mb-6">
          <h3 className="font-black text-slate-400 uppercase text-xs tracking-widest flex items-center gap-2 mb-4"><Layout size={16} /> Style Template</h3>
          <div className="grid grid-cols-3 gap-3">
            {Object.keys(templates).map(t => (
              <button key={t} onClick={() => setActiveTemplate(t)} className={`p-3 rounded-2xl border-2 transition-all ${activeTemplate === t ? 'border-indigo-600 bg-indigo-50 shadow-sm' : 'border-transparent bg-slate-50'}`}>
                <div className="h-6 w-full rounded-md mb-2" style={{ backgroundColor: templates[t].accent }}></div>
                <span className="text-[10px] font-black uppercase">{t}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6 pb-20">
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-black text-slate-400 uppercase text-xs tracking-widest flex items-center gap-2"><Type size={16} /> Header & Socials</h3>
            <div className="grid grid-cols-2 gap-4">
              <input name="name" value={resumeData.name} onChange={handleChange} placeholder="Full Name" className="p-3 bg-slate-50 rounded-xl outline-none font-bold text-sm" />
              <input name="role" value={resumeData.role} onChange={handleChange} placeholder="Current Role" className="p-3 bg-slate-50 rounded-xl outline-none font-bold text-sm" />
              <input name="email" value={resumeData.email} onChange={handleChange} placeholder="Email" className="p-3 bg-slate-50 rounded-xl outline-none font-bold text-sm" />
              <input name="phone" value={resumeData.phone} onChange={handleChange} placeholder="Phone" className="p-3 bg-slate-50 rounded-xl outline-none font-bold text-sm" />
              <input name="github" value={resumeData.github} onChange={handleChange} placeholder="GitHub URL" className="p-3 bg-slate-50 rounded-xl outline-none font-bold text-sm" />
              <input name="linkedin" value={resumeData.linkedin} onChange={handleChange} placeholder="LinkedIn URL" className="p-3 bg-slate-50 rounded-xl outline-none font-bold text-sm" />
              <input name="portfolio" value={resumeData.portfolio} onChange={handleChange} placeholder="Portfolio/Globe" className="p-3 bg-slate-50 rounded-xl outline-none font-bold text-sm col-span-2" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <h3 className="font-black text-slate-400 uppercase text-xs tracking-widest flex items-center gap-2 mb-4"><Award size={16} /> Skills Editor</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {resumeData.skills.map(s => (
                <span key={s} className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold flex items-center gap-1">
                  {s} <X size={14} className="cursor-pointer hover:text-red-500" onClick={() => removeSkill(s)} />
                </span>
              ))}
            </div>
            <input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={handleSkillAdd} placeholder="Type skill + Enter" className="w-full p-3 bg-slate-50 rounded-xl outline-none text-sm" />
          </div>

          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <div className="flex justify-between mb-4">
              <h3 className="font-black text-slate-400 uppercase text-xs tracking-widest flex items-center gap-2"><Sparkles size={16} /> Summary</h3>
              <button onClick={generateAISummary} disabled={isGenerating} className="text-[10px] font-black bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg uppercase tracking-wider">
                {isGenerating ? <Loader2 className="animate-spin" size={12} /> : "AI Generate"}
              </button>
            </div>
            <textarea name="summary" value={resumeData.summary} onChange={handleChange} className="w-full h-28 p-4 bg-slate-50 rounded-2xl outline-none text-sm font-medium border-none leading-relaxed" />
          </div>

          {[
            { id: 'experience', label: 'Experience', icon: <Briefcase size={16} /> },
            { id: 'projects', label: 'Projects', icon: <FolderKanban size={16} /> },
            { id: 'education', label: 'Education', icon: <GraduationCap size={16} /> },
            { id: 'certifications', label: 'Certifications', icon: <BadgeCheck size={16} /> }
          ].map((section) => (
            <div key={section.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
              <div className="flex justify-between mb-4">
                <h3 className="font-black text-slate-400 uppercase text-xs tracking-widest flex items-center gap-2">{section.icon} {section.label}</h3>
                <button onClick={() => addSectionItem(section.id)} className="p-2 bg-indigo-600 text-white rounded-lg"><Plus size={16} /></button>
              </div>
              <div className="space-y-4">
                {resumeData[section.id].map(item => (
                  <div key={item.id} className="p-4 bg-slate-50 rounded-2xl relative group">
                    <button onClick={() => removeSectionItem(section.id, item.id)} className="absolute top-2 right-2 text-red-400 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={16} /></button>
                    {section.id === 'experience' && (
                      <>
                        <div className="grid grid-cols-2 gap-2 mb-2">
                          <input placeholder="Company" value={item.company} onChange={(e) => updateSectionItem(section.id, item.id, 'company', e.target.value)} className="p-2 rounded-lg text-xs font-bold" />
                          <input placeholder="Duration" value={item.duration} onChange={(e) => updateSectionItem(section.id, item.id, 'duration', e.target.value)} className="p-2 rounded-lg text-xs font-bold" />
                        </div>
                        <input placeholder="Role" value={item.role} onChange={(e) => updateSectionItem(section.id, item.id, 'role', e.target.value)} className="w-full p-2 rounded-lg text-xs font-bold mb-2" />
                        <textarea placeholder="Achievements..." value={item.desc} onChange={(e) => updateSectionItem(section.id, item.id, 'desc', e.target.value)} className="w-full p-2 rounded-lg text-xs h-20" />
                      </>
                    )}
                    {section.id === 'projects' && (
                      <>
                        <div className="grid grid-cols-2 gap-2 mb-2">
                          <input placeholder="Project Title" value={item.title} onChange={(e) => updateSectionItem(section.id, item.id, 'title', e.target.value)} className="p-2 rounded-lg text-xs font-bold" />
                          <input placeholder="Tech Stack" value={item.tech} onChange={(e) => updateSectionItem(section.id, item.id, 'tech', e.target.value)} className="p-2 rounded-lg text-xs font-bold" />
                        </div>
                        <input placeholder="Link" value={item.link} onChange={(e) => updateSectionItem(section.id, item.id, 'link', e.target.value)} className="w-full p-2 rounded-lg text-xs font-bold mb-2" />
                        <textarea placeholder="Description" value={item.desc} onChange={(e) => updateSectionItem(section.id, item.id, 'desc', e.target.value)} className="w-full p-2 rounded-lg text-xs h-20" />
                      </>
                    )}
                    {section.id === 'education' && (
                      <>
                        <input placeholder="School" value={item.school} onChange={(e) => updateSectionItem(section.id, item.id, 'school', e.target.value)} className="w-full p-2 rounded-lg text-xs font-bold mb-2" />
                        <div className="grid grid-cols-2 gap-2">
                          <input placeholder="Degree" value={item.degree} onChange={(e) => updateSectionItem(section.id, item.id, 'degree', e.target.value)} className="p-2 rounded-lg text-xs font-bold" />
                          <input placeholder="Year" value={item.year} onChange={(e) => updateSectionItem(section.id, item.id, 'year', e.target.value)} className="p-2 rounded-lg text-xs font-bold" />
                        </div>
                      </>
                    )}
                    {section.id === 'certifications' && (
                      <>
                        <input placeholder="Cert Name" value={item.name} onChange={(e) => updateSectionItem(section.id, item.id, 'name', e.target.value)} className="w-full p-2 rounded-lg text-xs font-bold mb-2" />
                        <div className="grid grid-cols-2 gap-2">
                          <input placeholder="Issuer" value={item.issuer} onChange={(e) => updateSectionItem(section.id, item.id, 'issuer', e.target.value)} className="p-2 rounded-lg text-xs font-bold" />
                          <input placeholder="Date" value={item.date} onChange={(e) => updateSectionItem(section.id, item.id, 'date', e.target.value)} className="p-2 rounded-lg text-xs font-bold" />
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PREVIEW SIDE (Enhanced Font Sizes) */}
      <div className="w-1/2 bg-slate-200/50 p-12 flex justify-center overflow-y-auto">
        <div
          id="resume-preview"
          style={{
            backgroundColor: "#ffffff",
            color: "#1e293b",
            borderRadius: "24px"
          }}
          className="w-[210mm] min-h-[470mm] p-16 flex flex-col gap-10 shadow-lg"
        >
          <header style={{
            borderBottom: `5px solid ${templates[activeTemplate].accent}`,
            paddingBottom: '2.5rem',
            textAlign: templates[activeTemplate].alignment
          }}>
            <h1 style={{ color: '#0f172a', letterSpacing: '0px' }} className="text-6xl font-black mb-3 uppercase tracking-tighter">{resumeData.name}</h1>
            <p style={{ color: templates[activeTemplate].accent }} className="text-3xl font-bold italic mb-8 leading-tight">{resumeData.role}</p>

            <div style={{ color: '#94a3b8' }} className={`flex flex-wrap gap-8 text-sm font-black uppercase tracking-[0.1em] mb-4 ${templates[activeTemplate].alignment === 'center' ? 'justify-center' : ''}`}>
              <span className="flex items-center gap-2"><Mail size={16} /> {resumeData.email}</span>
              <span className="flex items-center gap-2"><Phone size={16} /> {resumeData.phone}</span>
              <span className="flex items-center gap-2"><MapPin size={16} /> {resumeData.location}</span>
            </div>

            <div style={{ color: templates[activeTemplate].accent }} className={`flex flex-wrap gap-10 text-sm font-black uppercase tracking-[0.1em] ${templates[activeTemplate].alignment === 'center' ? 'justify-center' : ''}`}>
              {resumeData.github && <span className="flex items-center gap-2"><Github size={16} /> {resumeData.github}</span>}
              {resumeData.linkedin && <span className="flex items-center gap-2"><Linkedin size={16} /> {resumeData.linkedin}</span>}
              {resumeData.portfolio && <span className="flex items-center gap-2"><Globe size={16} /> {resumeData.portfolio}</span>}
            </div>
          </header>

          <section>
            <h4 style={{ color: '#cbd5e1' }} className="font-black text-sm uppercase tracking-[0.35em] mb-5">Profile</h4>
            <p style={{ color: '#475569' }} className="text-xl leading-relaxed font-medium">{resumeData.summary}</p>
          </section>

          {/* Render Sections (Experience, Projects, Education, Certs) */}
          {[
            { id: 'experience', label: 'Work History', titleKey: 'role', subtitleKey: 'company', dateKey: 'duration' },
            { id: 'projects', label: 'Key Projects', titleKey: 'title', subtitleKey: 'tech', dateKey: 'link' },
            { id: 'education', label: 'Education', titleKey: 'school', subtitleKey: 'degree', dateKey: 'year' },
            { id: 'certifications', label: 'Certifications', titleKey: 'name', subtitleKey: 'issuer', dateKey: 'date' }
          ].map((sec) => (
            resumeData[sec.id].length > 0 && (
              <section key={sec.id} style={{ marginTop: '4rem' }}> {/* Added significant top spacing */}
                <h4
                  style={{
                    color: '#cbd5e1',
                    fontSize: '1.25rem', // Increased font size (approx 20px)
                    fontWeight: '900',   // Extra bold
                    borderBottom: `2px solid #f1f5f9`, // Added a subtle underline for structure
                    paddingBottom: '0.5rem'
                  }}
                  className="uppercase tracking-[0.4em] mb-10" // Increased letter spacing and bottom margin
                >
                  {sec.label}
                </h4>

                <div className="space-y-12"> {/* Increased spacing between individual items */}
                  {resumeData[sec.id].map(item => (
                    <div key={item.id} style={{ borderLeft: `4px solid #f1f5f9` }} className="relative pl-10">
                      <div
                        style={{ backgroundColor: templates[activeTemplate].accent, border: '5px solid #ffffff' }}
                        className="absolute -left-[14px] top-0 w-6 h-6 rounded-full shadow-sm"
                      ></div>

                      <div className="flex justify-between items-start mb-3">
                        <h5 style={{ color: '#0f172a' }} className="font-black text-3xl uppercase tracking-tight leading-none">
                          {item[sec.titleKey]}
                        </h5>
                        <span style={{ color: '#94a3b8' }} className="text-sm font-black uppercase">
                          {item[sec.dateKey]}
                        </span>
                      </div>

                      <p style={{ color: templates[activeTemplate].accent }} className="font-black text-sm uppercase mb-4 tracking-[0.2em]">
                        {item[sec.subtitleKey]}
                      </p>

                      {item.desc && (
                        <p style={{ color: '#64748b' }} className="text-xl leading-relaxed font-medium whitespace-pre-line">
                          {item.desc}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )
          ))}

          <section>
            <h4 style={{ color: '#cbd5e1' }} className="font-black text-sm uppercase tracking-[0.35em] mb-5">Core Expertise</h4>
            <div className="flex flex-wrap gap-3">
              {resumeData.skills.map(s => (
                <span key={s} style={{ backgroundColor: templates[activeTemplate].secondary, color: templates[activeTemplate].accent, border: `2px solid ${templates[activeTemplate].accent}40` }} className="px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest">{s}</span>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ResumeMaker;