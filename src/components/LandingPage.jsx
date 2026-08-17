import React from 'react';
import { ArrowRight, Code, PenTool, Megaphone, Edit3, TrendingUp, Settings, Briefcase, ChevronRight, Home, GraduationCap } from 'lucide-react';

export function LandingPage({ setActiveTab, companyInfo }) {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-sky-200">
      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200/50 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/logo.png" 
              onError={(e) => { e.target.onerror = null; e.target.src = "/logo.jpeg"; }} 
              alt="Dibuzz Logo" 
              className="w-12 h-12 object-contain rounded-xl drop-shadow-sm bg-white" 
            />
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
                {companyInfo?.name?.split(' ')[0] || 'DIBUZZ'}
              </h1>
              <p className="text-[10px] font-bold text-sky-600 tracking-[0.25em] uppercase mt-0.5">Digital</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setActiveTab('home')}
              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer hover:shadow-xl hover:-translate-y-0.5"
            >
              <GraduationCap className="w-5 h-5 text-sky-400" />
              <span className="hidden sm:inline">Internship Portal</span>
              <span className="sm:hidden">Portal</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section with Blurred Background Image */}
      <section className="relative min-h-[100vh] flex items-center pt-20 overflow-hidden">
        {/* Full-width Background Image fading into the left */}
        <div className="absolute inset-0 z-0 bg-slate-900">
          <img 
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80" 
            alt="Modern Business Building" 
            className="w-full h-full object-cover object-center lg:object-right opacity-70 mix-blend-overlay"
          />
          {/* Gradients to fade out the image towards left and bottom */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-slate-50/95 to-slate-50/20"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-transparent"></div>
          {/* Extra blur and gradient mask to make it look like a website part */}
          <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-transparent to-slate-50/50 backdrop-blur-sm lg:backdrop-blur-md" style={{ WebkitMaskImage: 'linear-gradient(to left, black, transparent)' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-20">
          <div className="max-w-2xl space-y-8 text-center lg:text-left mx-auto lg:mx-0">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-slate-200 text-slate-800 text-xs font-bold uppercase tracking-widest shadow-sm backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
              Strategy. Design. Development.
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight drop-shadow-sm">
              Solutions that <br className="hidden lg:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-blue-800">
                drive businesses
              </span> <br className="hidden lg:block" />
              forward.
            </h1>
            
            <p className="text-lg sm:text-xl text-slate-700 leading-relaxed font-medium max-w-xl mx-auto lg:mx-0 drop-shadow-sm">
              {companyInfo?.name || 'Dibuzz'} delivers creative and effective digital solutions that help brands grow, connect and succeed in the modern web.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 justify-center lg:justify-start">
              <button 
                onClick={() => setActiveTab('home')}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-sky-600/30 hover:shadow-xl hover:-translate-y-1 cursor-pointer text-sm"
              >
                Explore Internships <ArrowRight className="w-4 h-4" />
              </button>
              <button 
                onClick={() => {
                  document.getElementById('services').scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md cursor-pointer text-sm"
              >
                Our Services
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 lg:py-32 bg-white relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h3 className="text-xs font-black text-sky-600 uppercase tracking-widest mb-4">WHAT WE DO</h3>
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mb-6">Services We Provide</h2>
            <p className="text-slate-600 font-medium text-lg leading-relaxed">
              We offer end-to-end digital services to help businesses build a strong online presence and achieve real results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Code, title: "Web Development", desc: "We build fast, secure and scalable web solutions tailored to your business needs." },
              { icon: PenTool, title: "UI/UX Design", desc: "We design intuitive and engaging interfaces that deliver seamless user experiences." },
              { icon: Megaphone, title: "Digital Marketing", desc: "We create data-driven marketing strategies that increase visibility and drive growth." },
              { icon: Edit3, title: "Content Creation", desc: "We craft compelling content that tells your story and connects with your audience." },
              { icon: TrendingUp, title: "Brand Strategy", desc: "We help you build a strong brand identity that stands out in the market." },
              { icon: Settings, title: "Software Solutions", desc: "We develop custom software solutions that streamline processes and scale your business." }
            ].map((service, idx) => {
              const IconComp = service.icon;
              return (
                <div key={idx} className="p-8 rounded-[2rem] bg-slate-50 hover:bg-white border border-slate-100 hover:border-sky-200 hover:shadow-2xl hover:shadow-sky-900/5 transition-all duration-300 group flex flex-col items-start">
                  <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-sky-600 shadow-sm group-hover:bg-sky-600 group-hover:text-white group-hover:scale-110 transition-all flex-shrink-0 mb-6">
                    <IconComp className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-sky-700 transition-colors">{service.title}</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">{service.desc}</p>
                </div>
              )
            })}
          </div>
          
          <div className="mt-20 text-center">
            <button 
              onClick={() => setActiveTab('home')}
              className="inline-flex items-center gap-2 text-slate-900 font-black hover:text-sky-600 transition-colors cursor-pointer text-lg group"
            >
              Delivering Solutions. Driving Success. 
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Dark Footer CTA Section */}
      <section className="bg-slate-900 py-24 relative overflow-hidden sm:m-6 sm:rounded-[3rem] shadow-2xl mb-12">
        {/* Abstract shapes for background */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-500 rounded-full mix-blend-screen filter blur-[128px] opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600 rounded-full mix-blend-screen filter blur-[128px] opacity-20"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left">
          <div className="max-w-2xl">
            <h3 className="text-xs font-black text-sky-400 uppercase tracking-widest mb-6">WHY {companyInfo?.name?.split(' ')[0] || 'DIBUZZ'}?</h3>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
              We turn ideas into<br className="hidden md:block" /> digital success.
            </h2>
            <p className="text-lg text-slate-300 leading-relaxed font-medium max-w-xl mx-auto md:mx-0">
              Our expert team combines creativity, technology and strategy to deliver solutions that make an impact and create lasting value.
            </p>
          </div>
          <div className="flex-shrink-0 w-full md:w-auto">
            <button 
              onClick={() => setActiveTab('home')}
              className="px-10 py-5 rounded-2xl bg-white text-slate-900 hover:bg-sky-50 font-black flex items-center justify-center gap-3 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 cursor-pointer w-full"
            >
              Enter LMS Portal <ArrowRight className="w-5 h-5 text-sky-600" />
            </button>
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
      `}} />
    </div>
  );
}
