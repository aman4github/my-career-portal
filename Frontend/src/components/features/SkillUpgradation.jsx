import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, ExternalLink, PlayCircle, 
  BookOpen, CheckCircle, Target, Trophy, Sparkles, Loader2
} from 'lucide-react';
import { 
  Radar, RadarChart, PolarGrid, 
  PolarAngleAxis, ResponsiveContainer 
} from 'recharts';
import Swal from 'sweetalert2';

const SkillUpgradation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  

  const [completedSkills, setCompletedSkills] = useState([]);
  const [missingSkills, setMissingSkills] = useState([]); // State for missing skills
  const [isLoading, setIsLoading] = useState(true);

  // --- PERSISTENCE: INITIALIZE DATA ---
  useEffect(() => {

    const userData = JSON.parse(
      localStorage.getItem("user")
    );

    // NOT LOGGED IN
    if (!userData) {

      navigate("/");

    }


    const initializeData = async () => {
      if (!userData?.email) return;

      try {
        // 1. Fetch Checked/Completed Progress
        const progressRes = await fetch(`http://localhost:5000/get-progress?email=${userData.email}`);
        const progressData = await progressRes.json();
        setCompletedSkills(progressData.completedSkills || []);

        // 2. Resolve Missing Skills List
        if (location.state?.missingSkills) {
          // If we came from the Dashboard button
          setMissingSkills(location.state.missingSkills);
        } else {
          // If clicked from sidebar, fetch last analysis from SQLite
          const missingRes = await fetch(`http://localhost:5000/get-missing-skills?email=${userData.email}`);
          const missingData = await missingRes.json();
          setMissingSkills(missingData.missingSkills || []);
        }
      } catch (err) {
        console.error("Sync Error: Backend might be offline.");
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, [navigate, location.state]);

  // TOGGLE PROGRESS HANDLER
  const handleToggle = async (skill) => {
    const isCurrentlyDone = completedSkills.includes(skill);
    const newStatus = isCurrentlyDone ? 0 : 1;

    try {
      if (isCurrentlyDone) {
        setCompletedSkills(prev => prev.filter(s => s !== skill));
      } else {
        setCompletedSkills(prev => [...prev, skill]);
      }

      await fetch('http://localhost:5000/toggle-skill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
  email: userdata.email,
  skill: skill,
  status: newStatus
})
      });
    } catch (err) {
      // alert("SQLite Sync Failed. Check Python Server.");
    }
  };

  // RADAR CHART DATA CALCULATION
  const radarData = missingSkills.map(skill => ({
    subject: skill,
    A: completedSkills.includes(skill) ? 100 : 35,
    fullMark: 100,
  }));

  const baseMatch = 75;
  const progressGain = missingSkills.length > 0 ? (completedSkills.length / missingSkills.length) * 25 : 0;
  const totalReadiness = Math.round(baseMatch + progressGain);

  const getResourceLinks = (skill) => ({
    youtube: `https://www.youtube.com/results?search_query=${encodeURIComponent(skill)}+tutorial`,
    coursera: `https://www.coursera.org/courses?query=${encodeURIComponent(skill)}`,
    udemy: `https://www.udemy.com/courses/search/?q=${encodeURIComponent(skill)}`
  });

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Loader2 className="animate-spin text-indigo-600" size={48} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] rounded-[2.5rem] w-full text-slate-900 font-sans p-4 lg:p-8 overflow-x-hidden">
      
      {/* HEADER */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-black transition-all group">
          <div className="p-2 bg-white rounded-xl shadow-sm group-hover:bg-indigo-50 transition-all"><ArrowLeft size={20}/></div>
          BACK TO DASHBOARD
        </button>
        <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-[1.5rem] shadow-sm border border-slate-100">
          <Target className="text-indigo-600" size={24}/>
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Target Readiness</p>
            <p className="text-sm font-black text-indigo-600 uppercase leading-none">{completedSkills.length} / {missingSkills.length} Done</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-10">
        
        {/* LEFT: LEARNING TRACKS */}
        <div className="lg:col-span-2 space-y-8">
          <h2 className="text-5xl font-black italic uppercase tracking-tight leading-none">
            Skill <span className="text-indigo-600">Upgradation</span>
          </h2>
          
          <div className="grid gap-6">
            {missingSkills.length > 0 ? (
              missingSkills.map((skill, index) => {
                const links = getResourceLinks(skill);
                const isDone = completedSkills.includes(skill);
                return (
                  <div key={index} className={`bg-white p-8 rounded-[3rem] border transition-all ${isDone ? "border-green-200 opacity-80" : "border-slate-100 shadow-sm hover:shadow-xl"}`}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                      <div className="flex items-center gap-5">
                        <div className={`p-4 rounded-[1.5rem] ${isDone ? "bg-green-500 text-white" : "bg-indigo-600 text-white shadow-lg"}`}>
                          {isDone ? <CheckCircle size={28}/> : <BookOpen size={28}/>}
                        </div>
                        <h3 className={`text-2xl font-black uppercase tracking-tight ${isDone ? "line-through text-slate-400" : "text-slate-800"}`}>{skill}</h3>
                      </div>
                      <button onClick={() => handleToggle(skill)} className={`px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${isDone ? "bg-green-100 text-green-600" : "bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white"}`}>
                        {isDone ? "Mastered" : "Mark as Done"}
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <a href={links.youtube} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 p-4 bg-slate-50 rounded-2xl hover:bg-red-50 hover:text-red-600 transition-all font-black text-[10px] uppercase"><PlayCircle size={16}/> YouTube</a>
                      <a href={links.coursera} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 p-4 bg-slate-50 rounded-2xl hover:bg-blue-50 hover:text-blue-600 transition-all font-black text-[10px] uppercase"><ExternalLink size={16}/> Coursera</a>
                      <a href={links.udemy} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 p-4 bg-slate-50 rounded-2xl hover:bg-indigo-50 hover:text-indigo-600 transition-all font-black text-[10px] uppercase"><ExternalLink size={16}/> Udemy</a>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="bg-white p-12 rounded-[3rem] text-center border border-dashed border-slate-200">
                <p className="text-slate-400 font-bold uppercase tracking-widest">No missing skills identified yet. Analyze a resume on the dashboard!</p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: DATA VIZ */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
            <h4 className="font-black text-slate-400 text-[10px] uppercase tracking-[0.3em] mb-6 text-center">Visual Expertise Map</h4>
            <div className="h-[280px] w-full">
              {missingSkills.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                    <PolarGrid stroke="#f1f5f9" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: '900' }} />
                    <Radar name="Expertise" dataKey="A" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.5} />
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-[10px] font-black uppercase text-slate-300">Chart Pending Analysis</div>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-10 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden">
            <Trophy className="absolute -bottom-6 -right-6 opacity-20 rotate-12" size={160}/>
            <h4 className="text-xl font-black mb-4 uppercase italic">Career Readiness</h4>
            <div className="flex items-end gap-3 mb-6">
              <span className="text-7xl font-black tracking-tighter leading-none">{totalReadiness}</span>
              <span className="text-3xl font-black opacity-50 mb-1">%</span>
            </div>
            <div className="w-full bg-white/20 h-4 rounded-full overflow-hidden border border-white/10 p-1">
              <div className="bg-white h-full rounded-full transition-all duration-700" style={{ width: `${totalReadiness}%` }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillUpgradation;