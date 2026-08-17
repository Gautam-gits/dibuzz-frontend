import React from 'react';
import { ArrowRight, Code, PenTool, Megaphone, Edit3, TrendingUp, Settings, Briefcase } from 'lucide-react';

export function LandingPage({ setActiveTab, companyInfo }) {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center text-white font-black text-xl shadow-lg">
              {companyInfo?.name?.charAt(0) || 'D'}
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">
                {companyInfo?.name?.split(' ')[0] || 'DIBUZZ'}
              </h1>
              <p className="text-[9px] font-bold text-sky-600 tracking-[0.2em] uppercase">Digital</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setActiveTab('home')}
              className="px-5 py-2.5 rounded-xl bg-[#030B1E] hover:bg-sky-900 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <Briefcase className="w-4 h-4" />
              <span className="hidden sm:inline">Enroll for Internship</span>
              <span className="sm:hidden">Enroll</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 z-10">
              <h1 className="text-5xl lg:text-7xl font-black text-[#030B1E] leading-[1.1] tracking-tight">
                Solutions that<br/>drive businesses<br/>forward.
              </h1>
              <p className="text-lg text-slate-600 max-w-lg leading-relaxed font-medium">
                {companyInfo?.name || 'Dibuzz'} delivers creative and effective digital solutions that help brands grow, connect and succeed.
              </p>
              <div className="flex items-center gap-4 text-xs font-bold tracking-widest text-[#030B1E] uppercase">
                <div className="w-12 h-0.5 bg-[#030B1E]"></div>
                STRATEGY. DESIGN. DEVELOPMENT. GROWTH.
              </div>
              <button 
                onClick={() => setActiveTab('home')}
                className="mt-4 px-8 py-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold flex items-center gap-2 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 cursor-pointer"
              >
                Explore Training & Internships <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            
            <div className="relative mt-8 lg:mt-0">
              <div className="absolute inset-0 bg-gradient-to-tr from-sky-200 to-transparent rounded-[2rem] transform rotate-3 scale-105"></div>
              <img 
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80" 
                alt="Modern Business Building" 
                className="relative z-10 rounded-[2rem] shadow-2xl object-cover h-[400px] lg:h-[600px] w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h3 className="text-xs font-black text-sky-600 uppercase tracking-widest mb-4">WHAT WE DO</h3>
            <h2 className="text-4xl font-black text-[#030B1E] mb-4">Services We Provide</h2>
            <p className="text-slate-600 font-medium">
              We offer end-to-end digital services to help businesses build a strong online presence and achieve real results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Service 1 */}
            <div className="p-8 rounded-3xl bg-slate-50 hover:bg-white border border-transparent hover:border-slate-200 hover:shadow-xl transition-all flex flex-col sm:flex-row gap-6 group">
              <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-sky-600 shadow-sm group-hover:scale-110 transition-transform flex-shrink-0">
                <Code className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-[#030B1E] mb-2">Web Development</h4>
                <p className="text-slate-600 text-sm leading-relaxed">We build fast, secure and scalable web solutions tailored to your business needs.</p>
              </div>
            </div>

            {/* Service 2 */}
            <div className="p-8 rounded-3xl bg-slate-50 hover:bg-white border border-transparent hover:border-slate-200 hover:shadow-xl transition-all flex flex-col sm:flex-row gap-6 group">
              <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-sky-600 shadow-sm group-hover:scale-110 transition-transform flex-shrink-0">
                <PenTool className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-[#030B1E] mb-2">UI/UX Design</h4>
                <p className="text-slate-600 text-sm leading-relaxed">We design intuitive and engaging interfaces that deliver seamless user experiences.</p>
              </div>
            </div>

            {/* Service 3 */}
            <div className="p-8 rounded-3xl bg-slate-50 hover:bg-white border border-transparent hover:border-slate-200 hover:shadow-xl transition-all flex flex-col sm:flex-row gap-6 group">
              <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-sky-600 shadow-sm group-hover:scale-110 transition-transform flex-shrink-0">
                <Megaphone className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-[#030B1E] mb-2">Digital Marketing</h4>
                <p className="text-slate-600 text-sm leading-relaxed">We create data-driven marketing strategies that increase visibility and drive growth.</p>
              </div>
            </div>

            {/* Service 4 */}
            <div className="p-8 rounded-3xl bg-slate-50 hover:bg-white border border-transparent hover:border-slate-200 hover:shadow-xl transition-all flex flex-col sm:flex-row gap-6 group">
              <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-sky-600 shadow-sm group-hover:scale-110 transition-transform flex-shrink-0">
                <Edit3 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-[#030B1E] mb-2">Content Creation</h4>
                <p className="text-slate-600 text-sm leading-relaxed">We craft compelling content that tells your story and connects with your audience.</p>
              </div>
            </div>

            {/* Service 5 */}
            <div className="p-8 rounded-3xl bg-slate-50 hover:bg-white border border-transparent hover:border-slate-200 hover:shadow-xl transition-all flex flex-col sm:flex-row gap-6 group">
              <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-sky-600 shadow-sm group-hover:scale-110 transition-transform flex-shrink-0">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-[#030B1E] mb-2">Brand Strategy</h4>
                <p className="text-slate-600 text-sm leading-relaxed">We help you build a strong brand identity that stands out in the market.</p>
              </div>
            </div>

            {/* Service 6 */}
            <div className="p-8 rounded-3xl bg-slate-50 hover:bg-white border border-transparent hover:border-slate-200 hover:shadow-xl transition-all flex flex-col sm:flex-row gap-6 group">
              <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-sky-600 shadow-sm group-hover:scale-110 transition-transform flex-shrink-0">
                <Settings className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-[#030B1E] mb-2">Software Solutions</h4>
                <p className="text-slate-600 text-sm leading-relaxed">We develop custom software solutions that streamline processes and scale your business.</p>
              </div>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <button 
              onClick={() => setActiveTab('home')}
              className="inline-flex items-center gap-2 text-[#030B1E] font-bold hover:text-sky-600 transition-colors cursor-pointer"
            >
              Delivering Solutions. Driving Success. <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Dark Footer / Why Dibuzz Section */}
      <section className="bg-[#030B1E] py-24 relative overflow-hidden">
        {/* Background Waves pattern */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 100% 100%, rgba(56, 189, 248, 0.4) 0%, transparent 50%), radial-gradient(circle at 0% 0%, rgba(56, 189, 248, 0.2) 0%, transparent 50%)' }}></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-xl">
            <h3 className="text-xs font-black text-sky-500 uppercase tracking-widest mb-6">WHY {companyInfo?.name?.split(' ')[0] || 'DIBUZZ'}?</h3>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              We turn ideas into<br/>digital success.
            </h2>
            <p className="text-lg text-slate-300 mb-10 leading-relaxed">
              Our expert team combines creativity, technology and strategy to deliver solutions that make an impact and create lasting value.
            </p>
          </div>
          <div>
            <button 
              onClick={() => setActiveTab('home')}
              className="px-10 py-5 rounded-2xl bg-white text-[#030B1E] hover:bg-sky-50 font-black flex items-center gap-3 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 cursor-pointer"
            >
              Start Your Journey <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
