import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LogOut, Star, Loader2, FileText, Sparkles,
  LayoutDashboard, Target, TrendingUp, Cpu,
  User, Bell, Briefcase, AlertCircle, Download,
  Mic // <--- Add this here
} from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import OpenAI from 'openai';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';
import jsPDF from 'jspdf';
import domtoimage from 'dom-to-image-more';
import Swal from 'sweetalert2';

// Initialize PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
});

const Dashboard = () => {
  const navigate = useNavigate();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [insights, setInsights] = useState(null);
  const [status, setStatus] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const userdata = JSON.parse(
    localStorage.getItem("user")
  );

  if (!userdata) {
    return null;
  }

  const fetchLastAnalysis = async (email) => {
    try {
      const res = await fetch(`http://localhost:5000/get-analysis?email=${email}`);
      const data = await res.json();
      if (data.analysis) {
        setInsights(JSON.parse(data.analysis));
      }
    } catch (err) {
      console.error("Backend offline. Ensure Python app.py is running.");
    }
  };

  // --- MODERN PDF DOWNLOAD FUNCTION (Resolves oklch error) ---
  const downloadReport = async () => {
    const element = document.getElementById('full-dashboard-content');
    setStatus("Generating High-Res Report...");

    try {
      // Capture element as PNG blob via dom-to-image (handles modern CSS better)
      const dataUrl = await domtoimage.toPng(element, {
        bgcolor: '#F8FAFC',
        quality: 1,
        // Filter out buttons and inputs from the PDF
        filter: (node) => {
          if (node.classList && node.classList.contains('no-pdf-export')) return false;
          const isButton = node.tagName === 'BUTTON';
          const isInput = node.tagName === 'INPUT';
          const isTextArea = node.tagName === 'TEXTAREA';
          return !isButton && !isInput && !isTextArea;
        }
      });

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (element.offsetHeight * pdfWidth) / element.offsetWidth;

      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
      pdf.save(`${userdata?.name || "User"}_Career_Report.pdf`);
      setStatus("Download Complete!");

    } catch (error) {
      console.error('Report generation failed:', error);
      alert("Failed to generate PDF. Check if Backend/Assets are loading correctly.");
    } finally {
      setTimeout(() => setStatus(""), 3000);
    }
  };

  const handleAnalyze = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsAnalyzing(true);
    setStatus("Extracting Data...");

    try {
      const reader = new FileReader();
      const text = await new Promise((resolve) => {
        reader.onload = async (res) => {
          const pdf = await pdfjsLib.getDocument(new Uint8Array(res.target.result)).promise;
          let content = "";
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const txt = await page.getTextContent();
            content += txt.items.map(s => s.str).join(" ") + " ";
          }
          resolve(content);
        };
        reader.readAsArrayBuffer(file);
      });

      setStatus("AI is comparing...");

      const completion = await openai.chat.completions.create({

        model: "nvidia/nemotron-3-super-120b-a12b:free",

        messages: [
          {
            role: "user",
            content: `
You are an AI ATS Optimizer.

Compare Resume with Job Description.

Return ONLY valid JSON:

{
  "ats_score": number,
  "match_rate": number,
  "missing_keywords": [string],
  "missingSkills": [string],
  "skills": [{"name": string, "value": number}],
  "recommendations": [
    {
      "role": string,
      "salary": string,
      "match": number,
      "tip": string
    }
  ]
}

JOB DESCRIPTION:
${jobDescription || "General Industry Standards"}

RESUME:
${text}
`
          }
        ]

      });

      const aiText =
        completion.choices[0].message.content;

      const cleanedText = aiText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const result = JSON.parse(cleanedText);


      setInsights(result);

      localStorage.setItem(
        "analysis",
        JSON.stringify(result)
      );

      // --- SAVE TO SQLITE ---
      await fetch('http://localhost:5000/save-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userdata.email,
          analysis: JSON.stringify(result)
        })
      });

      setStatus("Analysis Complete & Saved!");
    } catch (err) {
      console.error(err);
      alert("Analysis failed. Please check your API key.");
    } finally {
      setIsAnalyzing(false);
    }
  };


  useEffect(() => {

    const userData = JSON.parse(
      localStorage.getItem("user")
    );

    if (!userData) {

      navigate("/");

    } else {

      // LOAD SAVED AI ANALYSIS
      fetchLastAnalysis(userData.email);

    }

  }, [navigate]);


  const logout = () => {
    localStorage.removeItem("user");
    console.log("logout")
    // alert("logged Out");
    Swal.fire({
      title: 'Success!',
      text: 'Logged Out Successfully',
      icon: 'success',
      confirmButtonText: 'OK'
    })
    navigate("/");

  }


  return (
    <div className="flex min-h-screen bg-[#F8FAFC] rounded-[2.5rem] w-full text-slate-900 font-sans overflow-hidden">


      {/* SIDEBAR */}
      
      <aside className="w-[260px] min-w-[260px] flex-shrink-0 bg-white border-r border-slate-200 flex flex-col p-6 gap-8 hidden lg:flex no-pdf-export">
        <div className="flex items-center gap-2 font-black text-xl text-indigo-600">
          <Cpu /> <span>SmartCareer</span>
        </div>

        <nav className="flex flex-col gap-2 flex-grow">
          <button onClick={() => navigate("/dashboard")} className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold bg-indigo-600 text-white shadow-lg transition-all">
            <LayoutDashboard size={20} /> Dashboard
          </button>

          <button onClick={() => navigate("/resume-maker")} className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-all">
            <FileText size={20} /> Resume Maker
          </button>

          <button onClick={() => navigate("/upgradation")} className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-all">
            <TrendingUp size={20} /> Skill Upgrade
          </button>

          {/* --- NEW MOCK INTERVIEW BUTTON --- */}
          <button onClick={() => navigate("/mock-interview")} className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-all">
            <Mic size={20} /> Mock Interview
          </button>

          <button onClick={() => navigate(`/profile-update/${userdata.id}`)} className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-all">
            <User size={20} /> Profile
          </button>
        </nav>

        <button onClick={logout} className="flex items-center gap-3 px-4 py-3 text-red-500 font-bold hover:bg-red-50 rounded-xl">
          <LogOut size={20} /> Logout
        </button>
      </aside>
      {/* MAIN CONTENT */}
      
      <main
        id="full-dashboard-content"
        className="flex-1 min-w-0 p-4 lg:p-8 overflow-y-auto h-screen bg-[#F8FAFC]"
      >
        <header className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black">Welcome back, {userdata.name}! 👋</h1>
            <p className="text-slate-500 font-medium tracking-tight">AI Insights persistent via SQLite3</p>
          </div>
          <div className="flex items-center gap-4 no-pdf-export">
            <div className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400"><Bell size={20} /></div>
          </div>
        </header>

        {/* JOB DESCRIPTION INPUT */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 mb-8 no-pdf-export">
          <h3 className="text-lg font-black mb-3 flex items-center gap-2 text-indigo-600"><Target size={18} /> Paste Target Job Description</h3>
          <textarea
            className="w-full h-32 p-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-indigo-500 outline-none transition-all text-sm font-medium"
            placeholder="Paste the job requirements here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
        </div>

        {/* UPLOAD SECTION */}
        <div className="mb-8 flex flex-col items-center p-8 bg-indigo-50 rounded-[2.5rem] border-2 border-dashed border-indigo-200 no-pdf-export">
          <input type="file" onChange={handleAnalyze} className="hidden" id="res-up" accept=".pdf" />
          <label htmlFor="res-up" className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 cursor-pointer hover:scale-105 transition-all shadow-xl">
            {isAnalyzing ? <Loader2 className="animate-spin" size={24} /> : <FileText size={24} />}
            {isAnalyzing ? status : "Upload & Analyze Resume"}
          </label>
        </div>

        {/* STAT CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: "ATS Score", val: insights?.ats_score || "--", icon: <Target /> },
            { label: "JD Match", val: insights?.match_rate || "--", icon: <Star /> },
            { label: "Skill Level", val: "85%", icon: <TrendingUp /> },
            { label: "Jobs Found", val: insights?.recommendations?.length || "0", icon: <Briefcase /> },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
              <div className="p-3 bg-slate-50 rounded-xl w-fit text-indigo-600 mb-3">{stat.icon}</div>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">{stat.label}</p>
              <h4 className="text-3xl font-black">{stat.val}{typeof stat.val === 'number' ? '%' : ''}</h4>
            </div>
          ))}
        </div>

        {/* ACTION CARD */}
        {insights && (
          <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-8 rounded-[2.5rem] text-white shadow-xl flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="p-4 bg-white/20 backdrop-blur-md rounded-3xl border border-white/20">
                  <Sparkles size={32} className="text-amber-300" />
                </div>
                <div>
                  <h3 className="text-2xl font-black uppercase tracking-tight">Analysis Complete</h3>
                  <p className="text-indigo-100 font-medium opacity-90">Download your report or master missing skills now.</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 w-full lg:w-auto no-pdf-export">
                <button
                  onClick={downloadReport}
                  className="flex-1 lg:flex-none bg-white/10 border border-white/20 text-white px-6 py-4 rounded-2xl font-black text-sm uppercase hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                >
                  <Download size={18} /> {status.includes("High-Res") ? "Processing..." : "Download Report"}
                </button>
                <button
                  onClick={() => navigate('/upgradation', { state: { missingSkills: insights.missingSkills } })}
                  className="flex-1 lg:flex-none bg-white text-indigo-600 px-8 py-4 rounded-2xl font-black text-sm uppercase hover:shadow-2xl transition-all"
                >
                  Upgrade Now
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CHARTS SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 min-h-[400px]">
              <h3 className="text-xl font-black mb-6">Resume Skills Breakdown</h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={insights?.skills || [{ name: 'Skill', value: 0 }]}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 'bold' }} />
                    <YAxis axisLine={false} tickLine={false} hide />
                    <Tooltip cursor={{ fill: '#F8FAFC' }} contentStyle={{ borderRadius: '12px', border: 'none' }} />
                    <Bar dataKey="value" fill="#4F46E5" radius={[6, 6, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {insights?.missing_keywords && (
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-red-50">
                <h3 className="text-xl font-black text-red-600 mb-4 flex items-center gap-2"><AlertCircle size={22} /> Missing Critical Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {insights.missing_keywords.map((kw, i) => (
                    <span key={i} className="px-4 py-2 bg-red-50 text-red-600 rounded-xl font-bold text-sm border border-red-100">+ {kw}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-6">
            <h3 className="text-xl font-black flex items-center gap-2"><Sparkles className="text-amber-400" size={20} /> AI Recommendations</h3>
            {insights?.recommendations?.map((job, i) => (
              <div key={i} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-4">
                  <h5 className="font-bold text-slate-900">{job.role}</h5>
                  <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-black">{job.match}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full mb-4">
                  <div className="bg-indigo-600 h-full transition-all" style={{ width: `${job.match}%` }}></div>
                </div>
                <p className="text-sm text-slate-500 font-medium mb-3">{job.tip}</p>
                <p className="text-xs font-black text-indigo-600 uppercase tracking-widest">{job.salary}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;