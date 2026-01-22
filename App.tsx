
import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, 
  Phone, 
  Menu, 
  X, 
  Users, 
  ArrowRight,
  Trophy,
  Target,
  Loader2,
  CheckCircle2,
  Dumbbell,
  Timer,
  HeartPulse,
  Award,
  Star,
  Quote,
  ChevronDown,
  Moon, 
  Sun,
  Instagram,
  Facebook,
  Twitter,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

// --- AI Utilities ---
const generateNanoImage = async (prompt: string): Promise<string | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: `Professional high-end luxury fitness photography, dramatic lighting, cinematic, 8k: ${prompt}` }] },
      config: {
        imageConfig: {
          aspectRatio: "16:9"
        }
      }
    });
    
    const candidate = response.candidates?.[0];
    if (candidate?.content?.parts) {
      for (const part of candidate.content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
  } catch (error) {
    console.error("Image generation failed", error);
  }
  return null;
};

// --- Custom Components ---
const NanoImage: React.FC<{ prompt: string; className?: string; delay?: number }> = ({ prompt, className, delay = 0 }) => {
  const [src, setSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      const img = await generateNanoImage(prompt);
      if (isMounted) {
        setSrc(img);
        setLoading(false);
      }
    };
    load();
    return () => { isMounted = false; };
  }, [prompt]);

  return (
    <div className={`relative overflow-hidden bg-zinc-900 shadow-2xl transition-all duration-1000 ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {loading ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : src ? (
        <img 
          src={src} 
          alt={prompt} 
          className="w-full h-full object-cover transition-all duration-1000 hover:scale-110" 
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-zinc-700 font-bold uppercase text-[10px]">
          <Loader2 className="w-4 h-4 text-zinc-700 animate-spin mr-2" />
          Retrying Media...
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
    </div>
  );
};

const SectionHeading: React.FC<{ subtitle: string; title: string; align?: 'left' | 'center' }> = ({ subtitle, title, align = 'center' }) => (
  <div className={`mb-16 reveal ${align === 'center' ? 'text-center' : 'text-left'}`}>
    <span className="text-primary font-black tracking-[0.4em] uppercase text-xs mb-4 block">{subtitle}</span>
    <h2 className="text-5xl md:text-8xl font-black text-white dark:text-white transition-colors leading-[0.9] uppercase italic">{title}</h2>
  </div>
);

// --- Sections ---
const Navbar: React.FC<{ theme: string; toggleTheme: () => void }> = ({ theme, toggleTheme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'FAQ', href: '#faq' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${scrolled ? 'glass py-4 border-b border-white/10' : 'bg-transparent py-8'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <a href="#home" className="flex items-center gap-4 group">
          <div className="p-2 bg-primary rounded-lg shadow-xl group-hover:rotate-[360deg] transition-transform duration-1000">
            <Trophy className="text-black w-6 h-6" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-2xl font-black tracking-tighter text-white uppercase italic">SK-27 GYM</span>
            <span className="text-[9px] font-black text-primary tracking-[0.4em] uppercase">HAUZ KHAS VILLAGE</span>
          </div>
        </a>

        <div className="hidden lg:flex items-center gap-10">
          {links.map((link) => (
            <a key={link.name} href={link.href} className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-primary transition-colors">
              {link.name}
            </a>
          ))}
          <button onClick={toggleTheme} className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-primary transition-all">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <a href="tel:09907050705" className="bg-primary hover:bg-white text-black px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20">
            JOIN NOW
          </a>
        </div>

        <button onClick={() => setIsOpen(true)} className="lg:hidden text-white p-2">
          <Menu size={28} />
        </button>
      </div>

      <div className={`fixed inset-0 bg-zinc-950 z-[200] flex flex-col items-center justify-center gap-12 transition-transform duration-700 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <button className="absolute top-8 right-8 text-zinc-400 hover:text-white" onClick={() => setIsOpen(false)}><X size={40} /></button>
        {links.map((link, i) => (
          <a key={link.name} href={link.href} onClick={() => setIsOpen(false)} className="text-5xl font-black text-white hover:text-primary uppercase italic tracking-tighter" style={{ transitionDelay: `${i * 100}ms` }}>{link.name}</a>
        ))}
        <button onClick={() => { toggleTheme(); setIsOpen(false); }} className="flex items-center gap-4 text-zinc-400 font-bold uppercase tracking-widest">
           {theme === 'dark' ? 'LIGHT MODE' : 'DARK MODE'}
           {theme === 'dark' ? <Sun /> : <Moon />}
        </button>
        <a href="tel:09907050705" className="bg-primary text-black px-16 py-6 rounded-full font-black text-xl uppercase tracking-widest mt-4 shadow-2xl">JOIN THE ELITE</a>
      </div>
    </nav>
  );
};

const Hero: React.FC = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden bg-zinc-950 pt-24 pb-20 md:pt-48">
      <div className="absolute inset-0 z-0">
        <NanoImage prompt="Atmospheric dark high-end gym interior with luxury weight machines and golden ambient lighting" className="w-full h-full opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/90 via-zinc-950/40 to-zinc-950" />
      </div>

      <div className="relative z-10 container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        <div className="text-center lg:text-left reveal stagger-1 active">
          <div className="inline-flex items-center gap-3 px-6 py-2 mb-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-full mx-auto lg:mx-0 shadow-xl">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </span>
            <span className="text-zinc-100 text-[10px] font-black tracking-[0.4em] uppercase">NOW OPEN AT HAUZ KHAS VILLAGE</span>
          </div>
          
          <h1 className="text-6xl md:text-[130px] lg:text-[150px] font-black text-white italic tracking-tighter leading-[0.8] mb-8 uppercase reveal stagger-2">
            BEYOND THE <br />
            <span className="text-primary text-glow empire-outline">LIMITS</span>
          </h1>
          
          <p className="text-zinc-400 text-lg md:text-2xl font-medium max-w-2xl mx-auto lg:mx-0 mb-14 leading-relaxed reveal stagger-3">
            Step into Delhi's most luxurious fitness sanctuary. Imported machinery, elite coaching, and a space designed for ultimate transformation.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center lg:justify-start gap-6 reveal stagger-4">
            <a href="#contact" className="group relative flex items-center justify-center gap-4 bg-primary text-black px-10 py-5 rounded-full font-black text-lg uppercase tracking-widest hover:bg-white transition-all shadow-2xl hover:scale-105 active:scale-95">
              BOOK A TRIAL
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </a>
            <a href="#about" className="px-10 py-5 border border-white/20 text-white rounded-full font-black text-lg uppercase tracking-widest hover:bg-white/5 transition-all">
              EXPLORE THE GYM
            </a>
          </div>
        </div>

        <div className="hidden lg:block reveal-right stagger-3">
          <div className="relative group">
            <div className="absolute -inset-4 bg-primary/10 blur-3xl group-hover:bg-primary/20 transition-all rounded-full" />
            <NanoImage 
              prompt="A bodybuilder training on luxury golden-black gym machines in a cinematic low-key environment" 
              className="relative z-10 w-full h-[650px] rounded-[60px] border border-white/10 shadow-3xl" 
            />
            <div className="absolute bottom-10 -right-10 z-20 bg-zinc-950 p-8 rounded-[40px] border border-primary/20 shadow-2xl hidden xl:block">
              <div className="flex items-center gap-4 mb-2">
                {[...Array(5)].map((_, i) => <Star key={i} className="text-primary fill-primary" size={20} />)}
              </div>
              <p className="text-white font-black italic text-xl uppercase leading-none mb-1">ELITE STATUS</p>
              <p className="text-zinc-500 font-bold text-[10px] uppercase tracking-widest">96+ GOOGLE REVIEWS</p>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce opacity-40">
        <div className="w-1 h-12 bg-primary rounded-full" />
      </div>
    </section>
  );
};

const AboutSection: React.FC = () => (
  <section id="about" className="py-32 bg-white dark:bg-zinc-950 text-zinc-950 dark:text-white relative overflow-hidden transition-colors">
    <div className="container mx-auto px-6 max-w-7xl">
      <div className="grid lg:grid-cols-2 gap-24 items-center">
        <div className="relative reveal-left">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary opacity-20 blur-3xl rounded-full" />
          <div className="relative z-10 grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <NanoImage prompt="Luxury gym interior with soft lighting and professional setup" className="rounded-3xl h-80 reveal-scale stagger-1" />
              <div className="bg-zinc-950 p-10 rounded-3xl shadow-2xl reveal stagger-2">
                <h3 className="text-primary font-black text-6xl leading-none italic mb-2 tracking-tighter">4.6</h3>
                <p className="text-zinc-500 font-black text-[10px] uppercase tracking-widest leading-tight">RATING ON GOOGLE REVIEWS</p>
              </div>
            </div>
            <div className="space-y-4 pt-12">
              <div className="bg-primary p-10 rounded-3xl shadow-2xl reveal stagger-3">
                <Clock className="text-black w-10 h-10 mb-6" />
                <h3 className="text-black font-black text-5xl leading-none italic mb-2 tracking-tighter">17H</h3>
                <p className="text-black/60 font-black text-[10px] uppercase tracking-widest leading-tight">OPEN FROM 6AM TO 11PM</p>
              </div>
              <NanoImage prompt="Detail shot of high-end imported barbell and weight plates" className="rounded-3xl h-80 reveal-scale stagger-4" />
            </div>
          </div>
        </div>

        <div className="reveal-right">
          <span className="text-primary font-black tracking-[0.4em] uppercase text-xs mb-6 block stagger-1">The Sanctuary</span>
          <h2 className="text-6xl md:text-8xl font-black text-zinc-950 dark:text-white italic mb-10 leading-[0.85] tracking-tighter uppercase stagger-2">
            DELHI'S ELITE <br />
            <span className="text-primary empire-outline" style={{ WebkitTextStrokeColor: 'currentColor' }}>EXPERIENCE</span>
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 text-xl mb-12 font-medium leading-relaxed stagger-3">
            Located at Building no 30, near Deer Park, Hauz Khas Village, Deer Park, Hauz Khas, New Delhi, Delhi 110016, SK-27 GYM is the pinnacle of strength training in the city. We combine high-performance equipment with a space designed for focus and luxury.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 mb-12 stagger-4">
            {[
              "Most Luxurious Setup",
              "Expert Personal Trainers",
              "Soft Spoken & Behaved Staff",
              "High-End Imported Machines"
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 group">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all">
                  <CheckCircle2 size={18} />
                </div>
                <span className="font-black uppercase tracking-widest text-[11px]">{item}</span>
              </div>
            ))}
          </div>
          
          <a href="#contact" className="inline-flex items-center gap-4 font-black text-primary hover:text-black transition-all uppercase tracking-[0.2em] text-sm group stagger-5">
            VISIT THE FACILITY <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </a>
        </div>
      </div>
    </div>
  </section>
);

const Services: React.FC = () => {
  const services = [
    { icon: <Dumbbell />, title: "Strength Floor", desc: "Equipped with world-class imported machinery for targeted hypertrophy." },
    { icon: <Timer />, title: "Elite HIIT", desc: "Tactical metabolic conditioning zones designed for maximum efficiency." },
    { icon: <HeartPulse />, title: "Cardio Zone", desc: "A curated range of treadmills and cycles with high-end tech integration." },
    { icon: <Target />, title: "Personal Prep", desc: "1-on-1 transformation coaching tailored to your individual anatomy." },
    { icon: <Users />, title: "Group Synergy", desc: "Premium group training experiences focused on functional mobility." },
    { icon: <Award />, title: "Nutrition Lab", desc: "Personalized diet protocols to fuel your evolution beyond the gym floor." },
  ];

  return (
    <section id="services" className="py-32 bg-zinc-950">
      <div className="container mx-auto px-6 max-w-7xl">
        <SectionHeading subtitle="The Arsenal" title="PREMIUM AMENITIES" />
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((s, i) => (
            <div key={i} className={`group bg-zinc-900 border border-white/5 p-10 rounded-[40px] hover:border-primary/50 hover:bg-zinc-800 transition-all duration-500 reveal-scale stagger-${(i%3)+1}`}>
              <div className="bg-zinc-800 text-primary w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-black transition-all duration-500 group-hover:rotate-6">
                {React.cloneElement(s.icon as any, { size: 32 })}
              </div>
              <h3 className="text-2xl font-black text-white mb-4 italic uppercase">{s.title}</h3>
              <p className="text-zinc-500 leading-relaxed font-medium">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Testimonials: React.FC = () => {
  const reviews = [
    { name: "Taniyaa rawat", role: "Elite Member", content: "Most luxurious place to visit worth for the money excellent staff service." },
    { name: "Mihika Bhaumik", role: "Athlete", content: "The equipment is high quality and the space is well designed." },
    { name: "k", role: "Regular Member", content: "The all employees here are so soft spoken and well-behaved." },
  ];

  return (
    <section id="testimonials" className="py-32 bg-zinc-900/20 border-y border-white/5 overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl">
        <SectionHeading subtitle="The Reputation" title="MEMBER FEEDBACK" />
        
        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((r, i) => (
            <div key={i} className={`bg-zinc-950 p-10 rounded-[40px] border border-white/10 relative reveal stagger-${i+1} group hover:border-primary/40 transition-all`}>
              <Quote className="text-primary/10 absolute top-10 right-10" size={60} />
              <div className="flex gap-1 mb-8">
                {[...Array(5)].map((_, j) => <Star key={j} size={16} className="fill-primary text-primary" />)}
              </div>
              <p className="text-zinc-300 text-xl italic mb-10 leading-relaxed group-hover:text-white transition-colors">"{r.content}"</p>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center font-black text-black text-xl">
                  {r.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-white font-black uppercase text-sm tracking-widest">{r.name}</h4>
                  <span className="text-primary text-[10px] font-black uppercase tracking-[0.2em]">{r.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FAQ: React.FC = () => {
  const [active, setActive] = useState<number | null>(0);
  const faqs = [
    { q: "What are the operating hours?", a: "We are open Monday to Saturday from 6:00 AM to 11:00 PM. On Sundays, we open early at 5:00 AM for early risers." },
    { q: "Do you offer personal training?", a: "Yes, we have a team of certified elite trainers specialized in bodybuilding, functional fitness, and body transformation." },
    { q: "Is there a trial session available?", a: "Absolutely! Contact our enrollment desk at 099070 50705 to book your first elite experience session." },
    { q: "What makes SK-27 different from local gyms?", a: "Our focus on imported high-end machinery, luxury ambiance, and a high standard of professional staff behavior sets us apart." }
  ];

  return (
    <section id="faq" className="py-32 bg-white dark:bg-zinc-950 text-zinc-950 dark:text-white transition-colors">
      <div className="container mx-auto px-6 max-w-4xl">
        <SectionHeading subtitle="Information" title="COMMON QUERIES" />
        <div className="space-y-4">
          {faqs.map((f, i) => (
            <div key={i} className="reveal stagger-1">
              <button 
                onClick={() => setActive(active === i ? null : i)}
                className={`w-full flex items-center justify-between p-8 rounded-3xl transition-all border ${active === i ? 'bg-primary text-black border-primary' : 'bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-white/5 hover:border-primary/50'}`}
              >
                <span className="text-lg font-black uppercase tracking-tight italic">{f.q}</span>
                <ChevronDown className={`transition-transform duration-500 ${active === i ? 'rotate-180' : ''}`} />
              </button>
              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${active === i ? 'max-h-60' : 'max-h-0'}`}>
                <div className="p-8 text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
                  {f.a}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Contact: React.FC = () => {
  const fullAddress = "Building no 30, near Deer Park, Hauz Khas Village, Deer Park, Hauz Khas, New Delhi, Delhi 110016";
  const mapUrl = `https://www.google.com/maps/search/${encodeURIComponent(fullAddress)}`;
  
  return (
    <section id="contact" className="py-32 bg-zinc-950 relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-24 items-stretch">
          <div className="reveal-left">
            <SectionHeading align="left" subtitle="Reach Out" title="GET IN TOUCH" />
            <div className="space-y-12">
              <div className="flex items-start gap-8 group">
                <div className="p-6 bg-zinc-900 border border-primary/20 rounded-[30px] text-primary group-hover:bg-primary group-hover:text-black transition-all duration-500">
                  <MapPin size={32} />
                </div>
                <div>
                  <h4 className="font-black text-2xl mb-2 text-white italic uppercase">The Command Center</h4>
                  <a href={mapUrl} target="_blank" className="text-zinc-400 text-lg hover:text-primary transition-colors leading-relaxed">
                    {fullAddress}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-8 group">
                <div className="p-6 bg-zinc-900 border border-primary/20 rounded-[30px] text-primary group-hover:bg-primary group-hover:text-black transition-all duration-500">
                  <Phone size={32} />
                </div>
                <div>
                  <h4 className="font-black text-2xl mb-2 text-white italic uppercase">Hotline</h4>
                  <a href="tel:09907050705" className="text-primary text-3xl md:text-4xl font-black tracking-tighter hover:text-white transition-all block">
                    099070 50705
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-8 group">
                <div className="p-6 bg-zinc-900 border border-primary/20 rounded-[30px] text-primary group-hover:bg-primary group-hover:text-black transition-all duration-500">
                  <Clock size={32} />
                </div>
                <div>
                  <h4 className="font-black text-2xl mb-2 text-white italic uppercase">Hours</h4>
                  <p className="text-zinc-400 text-lg">Mon - Sat: 6:00 AM – 11:00 PM</p>
                  <p className="text-zinc-400 text-lg">Sun: 5:00 AM – 11:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          <div className="reveal-right">
             <div className="bg-zinc-900/50 p-12 rounded-[50px] border border-white/5 h-full flex flex-col justify-center">
                <h3 className="text-4xl font-black italic mb-8 uppercase text-white">READY TO <span className="text-primary">START?</span></h3>
                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                  <input type="text" placeholder="YOUR FULL NAME" className="w-full bg-zinc-950/50 border border-white/10 rounded-2xl px-8 py-5 text-white focus:border-primary outline-none transition-all font-bold tracking-widest text-xs" />
                  <input type="tel" placeholder="MOBILE NUMBER" className="w-full bg-zinc-950/50 border border-white/10 rounded-2xl px-8 py-5 text-white focus:border-primary outline-none transition-all font-bold tracking-widest text-xs" />
                  <select className="w-full bg-zinc-950/50 border border-white/10 rounded-2xl px-8 py-5 text-zinc-500 focus:border-primary outline-none transition-all font-bold tracking-widest text-xs appearance-none">
                    <option>SELECT YOUR GOAL</option>
                    <option>WEIGHT LOSS</option>
                    <option>STRENGTH TRAINING</option>
                    <option>FLEXIBILITY</option>
                  </select>
                  <button className="w-full bg-primary text-black font-black uppercase tracking-widest py-6 rounded-2xl hover:bg-white transition-all shadow-xl active:scale-95">SEND TRANSMISSION</button>
                </form>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer: React.FC = () => (
  <footer className="py-20 border-t border-white/5 bg-zinc-950">
    <div className="container mx-auto px-6 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-center gap-12">
        <div className="flex flex-col items-center md:items-start gap-4">
           <div className="flex items-center gap-4">
            <div className="p-2 bg-primary rounded">
              <Trophy className="text-black w-5 h-5" />
            </div>
            <span className="text-2xl font-black italic tracking-tighter text-white uppercase leading-none">SK-27 GYM</span>
          </div>
          <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.4em]">HAUZ KHAS VILLAGE • NEW DELHI</p>
        </div>

        <div className="flex gap-10">
          <a href="#" className="text-zinc-500 hover:text-primary transition-all"><Instagram size={24} /></a>
          <a href="#" className="text-zinc-500 hover:text-primary transition-all"><Facebook size={24} /></a>
          <a href="#" className="text-zinc-500 hover:text-primary transition-all"><Twitter size={24} /></a>
        </div>

        <p className="text-zinc-700 text-[10px] font-black uppercase tracking-[0.2em] text-center md:text-right">
          &copy; {new Date().getFullYear()} SK-27 GYM • BEYOND THE LIMITS <br />
          DESIGNED FOR ELITE ATHLETES
        </p>
      </div>
    </div>
  </footer>
);

export default function App() {
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState('dark');

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          const staggers = entry.target.querySelectorAll('.stagger-1, .stagger-2, .stagger-3, .stagger-4');
          staggers.forEach(s => s.classList.add('active'));
        }
      });
    }, { threshold: 0.1 });

    setTimeout(() => {
      setLoading(false);
      setTimeout(() => {
        document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => observer.observe(el));
      }, 150);
    }, 1200);

    return () => observer.disconnect();
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-zinc-950 flex flex-col items-center justify-center gap-10 z-[1000]">
        <div className="relative">
          <Trophy className="text-primary w-20 h-20 animate-spin-slow" />
          <div className="absolute inset-0 bg-primary/20 blur-3xl animate-pulse" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="text-primary font-black tracking-[0.8em] text-[12px] uppercase animate-pulse">ESTABLISHING CONNECTION</span>
          <span className="text-zinc-600 text-[8px] font-bold uppercase tracking-[0.4em]">SK-27 ELITE HUB</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`antialiased selection:bg-primary selection:text-black transition-colors duration-500 ${theme === 'dark' ? 'dark' : ''}`}>
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <Hero />
      <div className="clip-slant -mt-32 pb-32">
        <AboutSection />
      </div>
      <Services />
      <Testimonials />
      <FAQ />
      <Contact />
      <Footer />
      
      {/* Scroll to Top */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-10 right-10 p-5 bg-primary text-black rounded-2xl shadow-2xl z-[90] hover:scale-110 active:scale-90 transition-all group"
      >
        <ArrowUpRight className="group-hover:rotate-45 transition-transform" />
      </button>
    </div>
  );
}
