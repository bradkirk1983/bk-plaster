import React, { useState, useCallback, useEffect } from 'react';
import { Phone, Mail, MapPin, Menu, X, CheckCircle2, ChevronRight, ChevronLeft, Instagram, Facebook, Plus } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../lib/firebase';

const SERVICES = [
  {
    title: 'Internal Plastering',
    description: 'Smooth, flawless finishes for your interior walls, ready for decorating.',
  },
  {
    title: 'External Rendering',
    description: 'Durable and weather-resistant rendering solutions including acrylic render, and traditional sand & cement.',
  },
  {
    title: 'Texture Coating',
    description: 'Decorative and protective textured finishes tailored to enhance the aesthetic and durability of your property.',
  },
  {
    title: 'Plaster Patching',
    description: 'Seamless repairs for cracks, holes, and water damage to restore your walls to perfect condition.',
  },
  {
    title: 'Structural Repair & Restoration',
    description: 'Expert repair and restoration of structural damage to ensure the safety and longevity of your surfaces.',
  }
];

interface Project {
  id: string;
  title: string;
  category: string;
  thumbnail: string;
  images: string[];
}

const GALLERY_PROJECTS: Project[] = [
  {
    id: 'manually-added-1',
    title: 'Rendering View 1',
    category: 'Architecture',
    thumbnail: 'https://lh3.googleusercontent.com/d/19276pBR_wu1rYxIB9sBMZdMGWtnIDk1f',
    images: ['https://lh3.googleusercontent.com/d/19276pBR_wu1rYxIB9sBMZdMGWtnIDk1f']
  },
  {
    id: 'manually-added-2',
    title: 'Rendering View 2',
    category: 'Architecture',
    thumbnail: 'https://lh3.googleusercontent.com/d/1NxQIQNLgJSGH5uCPdShNBd9e7OXP7Kvt',
    images: ['https://lh3.googleusercontent.com/d/1NxQIQNLgJSGH5uCPdShNBd9e7OXP7Kvt']
  },
  {
    id: 'manually-added-3',
    title: 'Rendering View 3',
    category: 'Architecture',
    thumbnail: 'https://lh3.googleusercontent.com/d/1hFM9i0kgjLF2PveseUZGxus-6rWk5z58',
    images: ['https://lh3.googleusercontent.com/d/1hFM9i0kgjLF2PveseUZGxus-6rWk5z58']
  },
  {
    id: 'manually-added-4',
    title: 'Rendering View 4',
    category: 'Architecture',
    thumbnail: 'https://lh3.googleusercontent.com/d/1aP-XdZ00E90O97EzX7oHLzBNlQhJKUjo',
    images: ['https://lh3.googleusercontent.com/d/1aP-XdZ00E90O97EzX7oHLzBNlQhJKUjo']
  },
  {
    id: 'manually-added-5',
    title: 'Rendering View 5',
    category: 'Architecture',
    thumbnail: 'https://lh3.googleusercontent.com/d/1p2VOYtlkwlzIOm0TBinHX637wJjkCAmt',
    images: ['https://lh3.googleusercontent.com/d/1p2VOYtlkwlzIOm0TBinHX637wJjkCAmt']
  },
  {
    id: 'manually-added-6',
    title: 'Rendering View 6',
    category: 'Architecture',
    thumbnail: 'https://lh3.googleusercontent.com/d/15S_mEuzOqPBcnMcyK4_cFAdLFoi0HRB0',
    images: ['https://lh3.googleusercontent.com/d/15S_mEuzOqPBcnMcyK4_cFAdLFoi0HRB0']
  },
  {
    id: 'manually-added-7',
    title: 'Rendering View 7',
    category: 'Architecture',
    thumbnail: 'https://lh3.googleusercontent.com/d/1S2ZQXIweJONTbWRxsnuy_xE4hMMUFhHs',
    images: ['https://lh3.googleusercontent.com/d/1S2ZQXIweJONTbWRxsnuy_xE4hMMUFhHs']
  },
  {
    id: 'manually-added-8',
    title: 'Rendering View 8',
    category: 'Architecture',
    thumbnail: 'https://lh3.googleusercontent.com/d/1npAUQzgMyoRVnSpmrMmMEpczgY-k-2-O',
    images: ['https://lh3.googleusercontent.com/d/1npAUQzgMyoRVnSpmrMmMEpczgY-k-2-O']
  },
  {
    id: 'manually-added-9',
    title: 'Rendering View 9',
    category: 'Architecture',
    thumbnail: 'https://lh3.googleusercontent.com/d/17KpEXA_i2aOpxRe44ahCeT6agQz1W7O-',
    images: ['https://lh3.googleusercontent.com/d/17KpEXA_i2aOpxRe44ahCeT6agQz1W7O-']
  },
  {
    id: 'manually-added-10',
    title: 'Rendering View 10',
    category: 'Architecture',
    thumbnail: 'https://lh3.googleusercontent.com/d/1F0B8ji3u9z6VgQWb7RYUESwxhP80FGlb',
    images: ['https://lh3.googleusercontent.com/d/1F0B8ji3u9z6VgQWb7RYUESwxhP80FGlb']
  },
  {
    id: 'manually-added-11',
    title: 'Rendering View 11',
    category: 'Architecture',
    thumbnail: 'https://lh3.googleusercontent.com/d/1m7vh0HjgeP20HcM_QedcZ7KNENxPNr98',
    images: ['https://lh3.googleusercontent.com/d/1m7vh0HjgeP20HcM_QedcZ7KNENxPNr98']
  },
  {
    id: 'manually-added-12',
    title: 'Rendering View 12',
    category: 'Architecture',
    thumbnail: 'https://lh3.googleusercontent.com/d/1q0jYH2ueW2napD07CzCAoE1dwnXz96N3',
    images: ['https://lh3.googleusercontent.com/d/1q0jYH2ueW2napD07CzCAoE1dwnXz96N3']
  },
  {
    id: 'manually-added-13',
    title: 'Rendering View 13',
    category: 'Architecture',
    thumbnail: 'https://lh3.googleusercontent.com/d/1FfghiNOgfGtw3PwC0joqcPMs4XCocacr',
    images: ['https://lh3.googleusercontent.com/d/1FfghiNOgfGtw3PwC0joqcPMs4XCocacr']
  },
  {
    id: 'manually-added-14',
    title: 'Rendering View 14',
    category: 'Architecture',
    thumbnail: 'https://lh3.googleusercontent.com/d/12zAzzMPLsGUz6iAN6zIqTGRrR9zZ2twq',
    images: ['https://lh3.googleusercontent.com/d/12zAzzMPLsGUz6iAN6zIqTGRrR9zZ2twq']
  },
  {
    id: 'manually-added-15',
    title: 'Rendering View 15',
    category: 'Architecture',
    thumbnail: 'https://lh3.googleusercontent.com/d/1UH0OMQXUu6cUGsnLGLGAfk6JuC3BVFto',
    images: ['https://lh3.googleusercontent.com/d/1UH0OMQXUu6cUGsnLGLGAfk6JuC3BVFto']
  }
];

// Project Modal Component
const ProjectModal = ({ project, onClose }: { project: Project, onClose: () => void }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/95 p-4 md:p-10">
      <button 
        onClick={onClose} 
        className="absolute top-4 right-4 md:top-8 md:right-8 text-white p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition"
      >
        <X className="w-6 h-6" />
      </button>
      
      <div className="relative w-full max-w-5xl bg-white rounded-xl overflow-hidden shadow-2xl flex flex-col">
         {/* Modal Carousel */}
         <div className="relative bg-slate-900">
           <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex">
                 {project.images.map((img, idx) => (
                    <div className="flex-[0_0_100%] min-w-0" key={idx}>
                       <img 
                         src={img} 
                         alt={`${project.title} - View ${idx + 1}`} 
                         className="w-full h-[40vh] md:h-[60vh] object-contain bg-slate-900" 
                         loading="lazy"
                         referrerPolicy="no-referrer"
                       />
                    </div>
                 ))}
              </div>
           </div>
           
           {project.images.length > 1 && (
             <>
                <button 
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-md transition" 
                  onClick={scrollPrev}
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button 
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-md transition" 
                  onClick={scrollNext}
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
             </>
           )}
         </div>
      </div>
    </div>
  );
};

export default function PublicSite() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeProjects, setActiveProjects] = useState<Project[]>(GALLERY_PROJECTS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      try {
        const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
        const qs = await getDocs(q);
        const fetchedProjects: Project[] = [];
        
        qs.forEach(doc => {
          fetchedProjects.push({ id: doc.id, ...doc.data() } as Project);
        });

        // Prioritize GALLERY_PROJECTS at the beginning
        setActiveProjects([...GALLERY_PROJECTS, ...fetchedProjects]);
      } catch (err) {
        console.error("Error loading projects from Firebase:", err);
        setActiveProjects(GALLERY_PROJECTS);
      } finally {
        setIsLoading(false);
      }
    }
    loadProjects();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white z-50 border-b border-slate-200 transition-all">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex justify-between items-center py-4 lg:py-6">
            {/* Logo */}
            <div className="flex flex-col">
              <a href="#" className="text-xl lg:text-2xl font-bold tracking-tight text-slate-900 leading-none">
                BK <span className="text-amber-600">PLASTERING & RENDERING</span>
              </a>
              <p className="hidden sm:block text-[10px] lg:text-xs uppercase tracking-widest text-slate-400 font-semibold mt-1">Excellence in Architectural Finishes</p>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">
              <a href="#home" className="text-amber-600 border-b-2 border-amber-600 pb-1 hover:text-amber-700 transition-colors">Home</a>
              <a href="#services" className="hover:text-amber-600 transition-colors pb-1 border-b-2 border-transparent hover:border-amber-600/50">Services</a>
              <a href="#gallery" className="hover:text-amber-600 transition-colors pb-1 border-b-2 border-transparent hover:border-amber-600/50">Gallery</a>
              <a href="#contact" className="hover:text-amber-600 transition-colors pb-1 border-b-2 border-transparent hover:border-amber-600/50">Contact</a>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-slate-600 hover:text-slate-900 focus:outline-none p-2 rounded-md hover:bg-slate-50 border border-transparent hover:border-slate-200"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2 shadow-sm absolute w-full left-0 top-[72px]">
            <a href="#home" onClick={() => setIsMenuOpen(false)} className="block px-3 py-3 text-sm font-bold text-slate-900 hover:text-amber-600 hover:bg-slate-50 rounded-lg">Home</a>
            <a href="#services" onClick={() => setIsMenuOpen(false)} className="block px-3 py-3 text-sm font-bold text-slate-900 hover:text-amber-600 hover:bg-slate-50 rounded-lg">Services</a>
            <a href="#gallery" onClick={() => setIsMenuOpen(false)} className="block px-3 py-3 text-sm font-bold text-slate-900 hover:text-amber-600 hover:bg-slate-50 rounded-lg">Gallery</a>
            <a href="#contact" onClick={() => setIsMenuOpen(false)} className="block px-3 py-3 text-sm font-bold text-slate-900 hover:text-amber-600 hover:bg-slate-50 rounded-lg">Contact</a>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
          <div className="lg:w-1/2 lg:pr-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-bold uppercase tracking-widest text-amber-700 bg-amber-100 rounded mb-8 border border-amber-200">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-600"></span>
              </span>
              Available for New Projects
            </div>
            <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
              Premium finishes for <br className="hidden lg:block"/>modern structures.
            </h1>
            <p className="text-slate-500 text-lg leading-relaxed max-w-lg mb-10">
              Specialising in high-end internal plastering and durable external rendering. We bring a flawless, contemporary aesthetic to luxury homes and commercial developments.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#contact" className="inline-flex items-center justify-center px-6 py-3 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-all">
                Get a Free Quote
              </a>
              <a href="#gallery" className="inline-flex items-center justify-center px-6 py-3 text-sm font-bold text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-all shadow-sm">
                View Our Work
              </a>
            </div>
          </div>
        </div>
        <div className="mt-12 lg:mt-0 lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 flex items-center justify-center lg:p-10">
          <div className="w-full h-[400px] lg:h-[80%] rounded-none lg:rounded-lg overflow-hidden lg:border border-slate-200 lg:shadow-sm relative">
             <img 
               src="https://giorgi.co/wp-content/uploads/2022/08/015-1.jpg" 
               alt="Modern home showcasing premium rendering" 
               className="w-full h-full object-cover"
               referrerPolicy="no-referrer"
             />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-slate-50 border-t border-slate-200 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="max-w-2xl mb-16">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight mb-4">Our Services</h2>
            <p className="text-slate-500 text-lg leading-relaxed">
              From internal skimming to weather-resistant external rendering, we provide a comprehensive range of plastering services.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((service, index) => (
              <div key={index} className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center mb-6 text-amber-700">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">{service.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-24 bg-white border-t border-slate-200 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight mb-4">Recent Projects</h2>
              <p className="text-slate-500 text-lg leading-relaxed">
                Take a look at some of our recent plastering and rendering transformations.
              </p>
            </div>
            <a href="#contact" className="hidden md:inline-flex items-center gap-2 text-amber-600 font-bold hover:text-amber-700 transition-colors">
              Start your project <ChevronRight className="h-4 w-4" />
            </a>
          </div>

          <div className="relative">
            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="aspect-video bg-slate-100 rounded-xl animate-pulse border border-slate-200"></div>
                ))}
              </div>
            ) : activeProjects.length === 0 ? (
              <div className="w-full py-16 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-center">
                <p className="text-slate-500 font-medium mb-4">No projects have been uploaded yet.</p>
                <a href="/admin" className="px-6 py-2 bg-amber-600 outline-none hover:bg-amber-700 text-white font-bold rounded-lg transition-colors">
                  Upload a Project
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {activeProjects.map((project) => (
                  <div 
                    key={project.id} 
                    onClick={() => setSelectedProject(project)}
                    className="group"
                  >
                    <div className="aspect-[4/3] bg-slate-100 rounded-2xl overflow-hidden border border-slate-200/60 relative shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer">
                      <img 
                        src={project.thumbnail} 
                        alt={project.title}
                        className="w-full h-full object-cover transform-gpu transition-transform duration-700 ease-out group-hover:scale-105"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
                         <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                            <Plus className="w-4 h-4 text-amber-600" />
                            <span className="text-xs font-bold text-slate-900 uppercase tracking-widest">View Photo</span>
                         </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
           <div className="mt-8 md:hidden">
            <a href="#contact" className="inline-flex items-center gap-2 text-amber-600 font-bold hover:text-amber-700 transition-colors">
              Start your project <ChevronRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-slate-50 border-t border-slate-200 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-7">
              <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight mb-4">Ready to <br className="hidden sm:block"/>transform your space?</h2>
              <p className="text-slate-500 text-lg leading-relaxed mb-12 max-w-lg">
                Get in touch with us today for a free, no-obligation quote. Our team is ready to discuss your specific requirements.
              </p>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-700 shadow-sm border border-slate-200">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-0.5">Call Us</h4>
                    <a href="tel:0477963445" className="text-sm font-bold text-slate-900 hover:text-amber-600 transition-colors">0477 963 445</a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-700 shadow-sm border border-slate-200">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-0.5">Email Us</h4>
                    <a href="mailto:bradkirk1983@hotmail.com" className="text-sm font-bold text-slate-900 hover:text-amber-600 transition-colors">bradkirk1983@hotmail.com</a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-700 shadow-sm border border-slate-200">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-0.5">Coverage Area</h4>
                    <p className="text-sm font-bold text-slate-900">Mandurah, Western Australia</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-5 bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Request a Consultation</h3>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid sm:grid-cols-2 gap-4">
                  <input type="text" id="firstName" className="w-full p-3 rounded-lg bg-slate-50 border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 placeholder:text-slate-400" placeholder="First Name" />
                  <input type="text" id="lastName" className="w-full p-3 rounded-lg bg-slate-50 border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 placeholder:text-slate-400" placeholder="Last Name" />
                </div>
                <input type="email" id="email" className="w-full p-3 rounded-lg bg-slate-50 border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 placeholder:text-slate-400" placeholder="Email Address" />
                
                <div className="relative">
                  <select id="service" className="w-full p-3 rounded-lg bg-slate-50 border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 appearance-none cursor-pointer text-slate-600">
                    <option value="">Service Required...</option>
                    <option value="internal-plastering">Internal Plastering</option>
                    <option value="external-rendering">External Rendering</option>
                    <option value="texture-coating">Texture Coating</option>
                    <option value="plaster-patching">Plaster Patching</option>
                    <option value="structural-repair">Structural Repair & Restoration</option>
                    <option value="other">Other / Not Sure</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                    <ChevronRight className="h-4 w-4 rotate-90" />
                  </div>
                </div>
                
                <textarea id="message" rows={4} className="w-full p-3 rounded-lg bg-slate-50 border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 resize-none placeholder:text-slate-400" placeholder="Project Details"></textarea>
                
                <button type="submit" className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 transition-colors mt-2">
                  Send Enquiry
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <div className="font-bold tracking-tight text-slate-900 mb-2 text-lg">
                BK <span className="text-amber-600">PLASTERING</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed uppercase tracking-widest">© {new Date().getFullYear()} BK Plastering & Rendering. All rights reserved. <br className="hidden sm:block"/> Registered & Licensed Contractors.</p>
            </div>
            
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-300 transition-all">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-300 transition-all">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Render Project Modal conditionally */}
      {selectedProject && (
        <ProjectModal 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)} 
        />
      )}
    </div>
  );
}
