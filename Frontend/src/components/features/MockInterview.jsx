import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Mic, Send, Bot, User,
  Sparkles, Award, RotateCcw, Play, Loader2, Volume2, X, CheckCircle2
} from 'lucide-react';
import OpenAI from 'openai';
import Swal from 'sweetalert2';


const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
});

const MockInterview = () => {
  const navigate = useNavigate();
  // const user = auth.currentUser;

  // --- STATE ---
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);
  const [resumeData, setResumeData] = useState(null);

  // New States for Scorecard & Control
  const [questionCount, setQuestionCount] = useState(0);
  const [showScorecard, setShowScorecard] = useState(false);
  const [finalGrade, setFinalGrade] = useState(null);

  // --- 1. LOAD CONTEXT FROM SQLITE ---
  useEffect(() => {

    const userData = JSON.parse(
      localStorage.getItem("user")
    );

    // NOT LOGGED IN
    if (!userData) {

      navigate("/");

      return;
    }

    const loadContext = async () => {
      if (userData?.email) {
        try {
          const res = await fetch(`http://localhost:5000/get-analysis?email=${userData.email}`);
          const data = await res.json();
          if (data.analysis) setResumeData(JSON.parse(data.analysis));
        } catch (err) {
          console.error("Context Error: Backend offline.");
        }
      }
    };
    loadContext();
  }, [navigate]);

  // --- 2. VOICE CONTROLS ---
  const speak = (text) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.1;
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsTyping(false);
  };

  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Use Chrome for Voice features.");

    const recognition = new SpeechRecognition();
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (e) => {
      setInput(e.results[0][0].transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.start();
  };

  // --- 3. INTERVIEW CORE LOGIC ---
  const startInterview = async () => {
    setMessages([]);
    setQuestionCount(0);
    setShowScorecard(false);
    setSessionActive(true);
    setIsTyping(true);

    const systemPrompt = `You are a Senior Technical Recruiter. Based on: ${JSON.stringify(resumeData)}. 
    Ask ONE challenging technical question. Focus on gaps: ${resumeData?.missingSkills?.join(", ")}.`;

    try {
      const completion = await openai.chat.completions.create({
        model: "nvidia/nemotron-3-super-120b-a12b:free",
        messages: [{ role: "system", content: systemPrompt }],
      });
      const firstMsg = completion.choices[0].message.content;
      setMessages([{ role: "assistant", content: firstMsg }]);
      speak(firstMsg);
    } catch (err) { console.error(err); }
    finally { setIsTyping(false); }
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    const isLastQuestion = questionCount === 4;

    try {
      const systemPrompt = isLastQuestion
        ? "The interview is over. Evaluate the candidate. Return ONLY JSON: { 'grade': 'A|B|C|D', 'feedback': 'summary', 'strengths': [3 items], 'weaknesses': [3 items] }"
        : "Evaluate the answer briefly and ask the next challenging technical question.";

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "system", content: systemPrompt }, ...messages, userMsg],
        response_format: isLastQuestion ? { type: "json_object" } : { type: "text" }
      });

      if (isLastQuestion) {
        const evalData = JSON.parse(completion.choices[0].message.content);
        setFinalGrade(evalData);
        setShowScorecard(true);
        setSessionActive(false);
      } else {
        const aiMsg = completion.choices[0].message.content;
        setMessages(prev => [...prev, { role: "assistant", content: aiMsg }]);
        setQuestionCount(prev => prev + 1);
        speak(aiMsg);
      }
    } catch (err) { console.error(err); }
    finally { setIsTyping(false); }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] rounded-[2.5rem] text-slate-900 font-sans p-4 lg:p-8 relative">

      {/* HEADER */}
      <div className="max-w-5xl mx-auto flex items-center justify-between mb-8">
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-black text-xs uppercase tracking-widest transition-all">
          <ArrowLeft size={18} /> Back to Hub
        </button>
        <div className="flex items-center gap-4">
          {sessionActive && (
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white px-4 py-2 rounded-full border border-slate-100">
              Round {questionCount + 1} / 5
            </div>
          )}
          <div className="bg-indigo-600 text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
            Live Assessment
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto grid lg:grid-cols-12 gap-8">

        {/* LEFT PANEL: INTERVIEWER */}
        <div className="lg:col-span-4 bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm flex flex-col items-center text-center h-fit sticky top-8">
          <div className={`w-32 h-32 rounded-[2.5rem] flex items-center justify-center mb-6 transition-all duration-500 ${isTyping ? "bg-indigo-600 text-white scale-110 shadow-2xl shadow-indigo-200" : "bg-slate-50 text-indigo-600"
            }`}>
            <Bot size={60} className={isTyping ? "animate-bounce" : ""} />
          </div>
          <h3 className="text-2xl font-black uppercase tracking-tight mb-1">AI Recruiter</h3>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-10">Technical Hiring Team</p>

          <div className="w-full space-y-3">
            {!sessionActive ? (
              <button onClick={startInterview} className="w-full px-4 mx-4 bg-indigo-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-100">
                <Play size={20} /> Start Interview
              </button>
            ) : (
              <>
                <button onClick={stopSpeaking} className="w-full bg-red-50 text-red-500 py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-red-500 hover:text-white transition-all border border-red-100">
                  <X size={18} /> Stop AI Voice
                </button>
                <button onClick={() => window.location.reload()} className="w-full bg-slate-50 text-slate-400 py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-200 transition-all">
                  <RotateCcw size={18} /> End Session
                </button>
              </>
            )}
          </div>
        </div>

        {/* RIGHT PANEL: CHAT */}
        <div className="lg:col-span-8 flex flex-col h-[650px] bg-white rounded-[3.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex-grow p-8 overflow-y-auto space-y-6 scroll-smooth bg-slate-50/30">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center opacity-30">
                <Volume2 size={48} className="mb-4 text-indigo-300" />
                <p className="font-black uppercase tracking-widest text-xs">Awaiting Interview Start</p>
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={`flex items-start gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`p-5 rounded-[2rem] max-w-[85%] text-sm font-bold leading-relaxed shadow-sm ${m.role === 'assistant'
                    ? 'bg-white text-slate-700 rounded-tl-none border border-slate-100'
                    : 'bg-indigo-600 text-white rounded-tr-none'
                  }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {isTyping && <div className="text-indigo-600 animate-pulse text-[10px] font-black uppercase tracking-widest ml-12">Recruiter is analyzing...</div>}
          </div>

          {/* INPUT AREA */}
          <div className="p-8 bg-white border-t border-slate-100 flex gap-4">
            <button onClick={handleVoiceInput} disabled={!sessionActive || isTyping} className={`p-5 rounded-2xl transition-all ${isListening ? "bg-red-500 text-white animate-pulse" : "bg-slate-50 text-slate-400 hover:text-indigo-600"}`}>
              <Mic size={24} />
            </button>
            <input
              disabled={!sessionActive}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder={isListening ? "I'm listening..." : "Your answer..."}
              className="flex-grow bg-slate-50 border-none rounded-2xl px-8 font-bold text-sm focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
            />
            <button disabled={!sessionActive || isTyping || !input.trim()} onClick={handleSend} className="p-5 bg-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-100 hover:scale-105 transition-all">
              <Send size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* FINAL SCORECARD MODAL */}
      {showScorecard && (
        <div className="fixed inset-0 bg-indigo-950/90 backdrop-blur-xl z-[100] flex items-center justify-center p-6 animate-in fade-in zoom-in duration-500">
          <div className="bg-white w-full max-w-2xl rounded-[4rem] p-12 text-center relative shadow-2xl border border-white/20">
            <Award size={80} className="mx-auto text-indigo-600 mb-6" />
            <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-1">Interview Summary</h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-10">Candidate Assessment Report</p>

            <div className="flex items-center justify-center gap-12 mb-12">
              <div className="text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Grade</p>
                <div className="text-8xl font-black text-indigo-600 tracking-tighter">{finalGrade?.grade}</div>
              </div>
              <div className="text-left flex-grow bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <p className="text-[10px] font-black text-indigo-400 uppercase mb-2 italic">Feedback</p>
                <p className="text-sm font-bold text-slate-600 leading-relaxed italic">"{finalGrade?.feedback}"</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-12">
              <div className="text-left space-y-3">
                <p className="text-[10px] font-black text-green-500 uppercase flex items-center gap-2"><CheckCircle2 size={14} /> Top Strengths</p>
                {finalGrade?.strengths?.map((s, i) => <div key={i} className="text-xs font-black text-slate-600 bg-green-50 p-2 rounded-lg">{s}</div>)}
              </div>
              <div className="text-left space-y-3">
                <p className="text-[10px] font-black text-amber-500 uppercase flex items-center gap-2"><Sparkles size={14} /> Focus Areas</p>
                {finalGrade?.weaknesses?.map((w, i) => <div key={i} className="text-xs font-black text-slate-600 bg-amber-50 p-2 rounded-lg">{w}</div>)}
              </div>
            </div>

            <button onClick={() => navigate('/dashboard')} className="w-full bg-indigo-600 text-white py-6 rounded-3xl font-black uppercase tracking-widest shadow-2xl hover:bg-indigo-700 transition-all">
              Complete Assessment
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MockInterview;