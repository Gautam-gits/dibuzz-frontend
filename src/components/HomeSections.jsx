import React, { useState } from 'react';
import { ShieldCheck, Building2, Sparkles, GraduationCap, Briefcase, Code, Rocket, Users, Target, Clock, ArrowRight } from 'lucide-react';

export function HomeSections({ companyInfo, setActiveTab, currentUser, onOpenAuthModal, internships = [], faqs = [], onEnrollCourse }) {
  const [openFaq, setOpenFaq] = useState(0);

  const topicImages = {
    'Python Programming':        'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=600&q=80',
    'Web Development':           'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80',
    'Artificial Intelligence':   'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=600&q=80',
    'Machine Learning':          'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
    'Internet of Things':        'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
    'AutoCAD':                   'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=600&q=80',
    'SolidWorks':                'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80',
    'MATLAB':                    'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=600&q=80',
  };

  const getImage = (title) => {
    const key = Object.keys(topicImages).find(k => title?.includes(k.split(' ')[0]));
    return key ? topicImages[key] : 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80';
  };

  const homeInternships = [
    {
      id: 1,
      title: "Python Programming",
      company: companyInfo.name || "DIBUZZ DIGITAL PRIVATE LIMITED",
      price: 444,
      duration: "4 to 6 Weeks",
      badge: "3rd Sem",
      image: "/python-card.jpg",
      skills: ["Python 3", "Data Structures", "OOPs", "APIs"],
      description: "Online Python programming internship covering data structures, object-oriented concepts, and API integration."
    },
    {
      id: 2,
      title: "Web Development",
      company: companyInfo.name || "DIBUZZ DIGITAL PRIVATE LIMITED",
      price: 444,
      duration: "4 to 6 Weeks",
      badge: "3rd Sem",
      image: "/webdev-card.jpg",
      skills: ["HTML5", "CSS3", "JavaScript", "React"],
      description: "Build modern responsive websites and web application interfaces with real-world development practices."
    },
    {
      id: 3,
      title: "Artificial Intelligence (AI)",
      company: companyInfo.name || "DIBUZZ DIGITAL PRIVATE LIMITED",
      price: 444,
      duration: "4 to 6 Weeks",
      badge: "3rd Sem",
      image: "/ai-card.jpg",
      skills: ["AI Models", "Prompt Eng", "OpenAI APIs"],
      description: "Explore cutting-edge Artificial Intelligence models, prompt engineering techniques, and LLM API integrations."
    }
  ];

  const handleEnrollClick = (item) => {
    if (onEnrollCourse) {
      onEnrollCourse(item);
    }
  };

  const features = [
    {
      icon: ShieldCheck,
      title: "MCA Govt & MSME Recognized",
      desc: "Get nationally and internationally verifiable digital certificates with unique Certificate ID & QR code verification.",
      color: "emerald"
    },
    {
      icon: Code,
      title: "Live Capstone Project Sprints",
      desc: "Work on real-world production codebases, REST API microservices, and modern UI frameworks with senior tech leads.",
      color: "sky"
    },
    {
      icon: Briefcase,
      title: "Guaranteed Internship Program",
      desc: "Access paid stipend opportunities (up to ₹20,000/mo) and free academic credit skill internships.",
      color: "amber"
    },
    {
      icon: Users,
      title: "1-on-1 Dedicated Mentor Support",
      desc: "Never get stuck on bugs! Get instant code reviews, 1-on-1 doubt clearing, and personalized guidance.",
      color: "purple"
    },
    {
      icon: Rocket,
      title: "100% Placement Drives",
      desc: "Resume optimization, LinkedIn branding, mock interview rounds, and direct referral drives with top tech companies.",
      color: "orange"
    },
    {
      icon: Target,
      title: "Flexible & Self-Paced LMS",
      desc: "Lifetime access to cohort lecture recordings, downloadable code repositories, and tax receipts.",
      color: "indigo"
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Select Your Career Track",
      desc: "Choose from Full Stack MERN, Data Science & AI, Python Automation, or DCA computer certification."
    },
    {
      number: "02",
      title: "Learn with Live Sprints",
      desc: "Attend interactive live mentor cohorts and master industry tools step-by-step."
    },
    {
      number: "03",
      title: "Build Real Portfolio & Internships",
      desc: "Complete 5+ capstone projects and join live corporate or academic credit internships."
    },
    {
      number: "04",
      title: "Get Certified & Hired",
      desc: "Verify your certificate online and get placed at top tech leaders."
    }
  ];

  

  return (
    <div className="space-y-16 py-12">

      {/* FEATURED SEMESTER INTERNSHIPS PREVIEW (3 CARDS) */}
      <section className="bg-white py-12 border-t border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-extrabold uppercase tracking-wider mb-2 font-mono">
                <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
                <span>3rd Semester Online Internships</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight font-heading">
                Featured 3rd Sem Internships
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                Enroll in top 3rd Semester technical training programs with official certificates
              </p>
            </div>

            <button
              onClick={() => setActiveTab('internships')}
              className="px-5 py-2.5 rounded-xl text-xs font-extrabold text-white bg-slate-900 hover:bg-slate-800 shadow-2xs transition-all cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap self-start sm:self-auto hover:scale-[1.03] active:scale-[0.97]"
            >
              <span>More Internships</span>
              <ArrowRight className="w-4 h-4 text-sky-400" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            { (internships.length > 0 ? internships.slice(0, 3) : homeInternships).map((item) => (
              <div
                key={item.id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col justify-between group relative shadow-xs hover:border-sky-400 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div>
                  <div className="relative h-40 w-full overflow-hidden bg-slate-100">
                    <img
                      src={item.image || getImage(item.title)}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 left-2 flex gap-1">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-900/80 text-white backdrop-blur-xs font-mono">
                        {item.badge || '3rd Sem'}
                      </span>
                    </div>
                    <div className="absolute top-2 right-2">
                      <span className="text-xs font-black text-white font-mono bg-emerald-600 px-2.5 py-0.5 rounded-md shadow-xs">
                        {item.stipend || 'Coming Soon'}
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="text-base font-extrabold text-slate-900 group-hover:text-sky-600 transition-colors font-heading leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-[11px] font-semibold text-slate-500 mt-1 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-sky-600" />
                      {item.company || companyInfo.name || 'DIBUZZ DIGITAL'}
                    </p>

                    <div className="my-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 text-[11px]">Fee / Stipend:</span>
                        <span className="font-extrabold text-emerald-700 font-mono">{item.stipend || 'Coming Soon'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 text-[11px]">Duration:</span>
                        <span className="text-slate-900 font-semibold text-[11px] flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3 text-slate-400" /> {item.duration || '4-6 Weeks'}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mb-3 font-normal">
                      {item.description}
                    </p>

                    <div className="flex flex-wrap gap-1">
                      {(item.skills || []).map((skill, idx) => (
                        <span key={idx} className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
                  <span className="text-[10px] font-semibold text-slate-500 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified Cert
                  </span>
                  <button
                    onClick={() => handleEnrollClick(item)}
                    className="px-4 py-2 rounded-xl text-xs font-extrabold text-white bg-sky-600 hover:bg-sky-700 shadow-xs transition-all cursor-pointer flex items-center gap-1"
                  >
                    <span>{item.stipend && item.stipend.includes('Free') ? 'Enroll Now' : 'Join Waitlist'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <button
              onClick={() => setActiveTab('internships')}
              className="w-full py-3 rounded-xl text-xs font-extrabold text-white bg-slate-900 hover:bg-slate-800 shadow-2xs flex items-center justify-center gap-2"
            >
              <span>More Internships</span>
              <ArrowRight className="w-4 h-4 text-sky-400" />
            </button>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE DIBUZZ SECTION */}
      <section className="bg-slate-50 py-12 border-t border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-xs font-extrabold uppercase tracking-wider mb-3 shadow-xs">
              <Sparkles className="w-4 h-4 text-sky-600" />
              <span>The DIBUZZ Digital Advantage</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight font-heading">
              Why Students Trust DIBUZZ DIGITAL
            </h2>
            <p className="text-slate-600 text-xs sm:text-base mt-2 font-medium">
              We combine industry-relevant hands-on learning with corporate accreditations to guarantee real career growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div key={idx} className="edumantra-card bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between group hover:border-sky-300 transition-all">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-100 text-sky-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <IconComp className="w-6 h-6" />
                    </div>

                    <h3 className="text-base font-extrabold text-slate-900 mb-1.5 font-heading">
                      {item.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight font-heading">
              Your 4-Step Path to Placement
            </h2>
            <p className="text-slate-600 text-xs sm:text-base mt-2 font-medium">
              How DIBUZZ DIGITAL transforms engineering students into industry-ready software developers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, idx) => (
              <div key={idx} className="relative p-6 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-3xl font-black font-mono text-sky-600 mb-2">
                  {step.number}
                </div>
                <h3 className="text-base font-extrabold text-slate-900 mb-2 font-heading">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS */}
      <section className="py-12 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight font-heading">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-600 text-xs sm:text-base mt-2 font-medium">
              Clear answers to common questions about admissions, certificates & training.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-5 text-left font-extrabold text-sm text-slate-900 flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span>{faq.question || faq.q}</span>
                  <span className="text-sky-600 font-mono text-lg">{openFaq === idx ? '−' : '+'}</span>
                </button>

                {openFaq === idx && (
                  <div className="px-5 pb-5 pt-0 text-xs text-slate-600 leading-relaxed font-normal border-t border-slate-100 mt-3 pt-3">
                    {faq.answer || faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
