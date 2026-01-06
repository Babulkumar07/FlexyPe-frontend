
import React, { useState, useEffect, useMemo } from 'react';
import { MOCK_PROOF } from './constants';
import { ProofType, FilterType, SocialProofItem } from './types';
import { summarizeSentiment } from './services/gemini';

const ProofCard = ({ item, key }: { item: SocialProofItem; key: string }) => {
  const getIcon = () => {
    switch (item.type) {
      case ProofType.TWITTER:
        return (
          <svg className="w-5 h-5 text-sky-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
          </svg>
        );
      case ProofType.INSTAGRAM:
        return (
          <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"></path>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
          </svg>
        );
      case ProofType.REVIEW:
        return (
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className={`w-3.5 h-3.5 ${i < (item.rating || 5) ? 'text-amber-400' : 'text-slate-200'}`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        );
      case ProofType.VIDEO:
        return (
          <div className="bg-slate-900 rounded-full p-1.5 shadow-lg">
            <svg className="w-4 h-4 text-white fill-current" viewBox="0 0 20 20">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.333-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="bg-indigo-600 rounded-full p-1.5 shadow-lg">
             <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
             </svg>
          </div>
        );
    }
  };

  return (
    <div className="break-inside-avoid mb-6 group animate-fade-up">
      <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-100 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-indigo-100 hover:-translate-y-1">
        {item.imageUrl && (
          <div className="relative overflow-hidden aspect-[4/5]">
            <img 
              src={item.imageUrl} 
              alt="Customer product review" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute top-4 right-4 z-10">
              {getIcon()}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        )}
        
        <div className="p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="relative">
              <img src={item.user.avatar} alt={item.user.name} className="w-12 h-12 rounded-full border-2 border-white shadow-md bg-slate-100" />
              {item.user.isVerified && (
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                  <svg className="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-slate-900 truncate text-sm tracking-tight">{item.user.name}</h4>
              <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
                {item.user.handle || item.type} • {item.timestamp}
              </p>
            </div>
            {!item.imageUrl && <div className="flex-shrink-0">{getIcon()}</div>}
          </div>

          <p className="text-slate-600 text-[15px] leading-relaxed mb-6 font-medium">
            "{item.content}"
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {item.tags.map(tag => (
              <span key={tag} className="text-[10px] px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-lg font-bold tracking-tight">
                #{tag.toUpperCase()}
              </span>
            ))}
          </div>
        </div>
        
        <a 
          href={item.sourceUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="block w-full text-center py-3 bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hover:bg-indigo-600 hover:text-white transition-all duration-300 border-t border-slate-100"
        >
          Verify Source
        </a>
      </div>
    </div>
  );
};

export default function App() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [aiInsight, setAiInsight] = useState<{summary: string, highlights: string[]} | null>(null);
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);

  useEffect(() => {
    async function fetchInsight() {
      setIsLoadingInsight(true);
      const insight = await summarizeSentiment(MOCK_PROOF);
      setAiInsight(insight);
      setIsLoadingInsight(false);
    }
    fetchInsight();
  }, []);

  const filteredProof = useMemo(() => {
    return MOCK_PROOF.filter(item => {
      const matchesFilter = activeFilter === 'all' || item.type === activeFilter;
      const matchesSearch = 
        item.content.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, searchQuery]);

  return (
    <div className="min-h-screen bg-[#FDFDFF] selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation Branding */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-black tracking-tighter text-slate-900 flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-white rounded-sm rotate-45" />
            </div>
            FlexyPe
          </div>
          <div className="hidden md:flex gap-8 text-sm font-bold text-slate-400 uppercase tracking-widest">
            {/* <a href="#" className="hover:text-indigo-600 transition-colors">Shop</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Performance</a> */}
            <a href="#" className="text-indigo-600 border-b-2 border-indigo-600">Community</a>
          </div>
          <button className="bg-slate-900 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-indigo-600 transition-colors shadow-lg shadow-black/5">
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="pt-40 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-indigo-50/50 to-transparent -z-10" />
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-100 shadow-sm text-indigo-600 text-xs font-black uppercase tracking-[0.2em] mb-8 animate-fade-in">
            <span className="flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
            </span>
            Community First
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-slate-900 mb-8 tracking-tighter leading-[0.9]">
            Built by us.<br/>Proven by <span className="text-indigo-600">you.</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
            Real feedback from the FlexyPe community. Unedited, unfiltered, and strictly authentic. 
            Join 50,000+ athletes who switched.
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6">
        {/* AI Community Sentiment Card */}
        <section className="mb-20">
          <div className="bg-white rounded-[2rem] p-10 border border-slate-100 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 blur-[100px] -mr-32 -mt-32 rounded-full" />
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900 tracking-tight text-uppercase">THE FLEXY PULSE</h3>
                      <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Real-time AI Sentiment</p>
                    </div>
                  </div>
                  {isLoadingInsight ? (
                    <div className="space-y-3 animate-pulse">
                      <div className="h-5 bg-slate-100 rounded-full w-full"></div>
                      <div className="h-5 bg-slate-100 rounded-full w-3/4"></div>
                    </div>
                  ) : (
                    <p className="text-2xl md:text-3xl font-bold text-slate-800 leading-tight tracking-tight">
                      "{aiInsight?.summary || 'FlexyPe is setting new standards in high-performance gear with unparalleled community trust.'}"
                    </p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 shrink-0">
                   {(aiInsight?.highlights || ['ELITE COMFORT', 'FAST SHIPPING', 'TRUE SIZING']).map((h, i) => (
                    <div key={i} className="group flex items-center gap-3 px-6 py-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:bg-white transition-all duration-300">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 group-hover:scale-125 transition-transform" />
                      <span className="text-xs font-black text-slate-700 uppercase tracking-wider">{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic Filtering System */}
        <section className="sticky top-20 z-40 mb-16">
          <div className="p-3 bg-white/70 backdrop-blur-2xl border border-slate-100 rounded-3xl shadow-2xl flex flex-col md:flex-row items-center gap-4">
            <div className="flex items-center gap-1.5 w-full md:w-auto p-1.5 bg-slate-50/50 rounded-2xl overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveFilter('all')}
                className={`flex-none px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${
                  activeFilter === 'all' 
                  ? 'bg-white text-indigo-600 shadow-sm border border-slate-100' 
                  : 'text-slate-400 hover:text-slate-900'
                }`}
              >
                Show All
              </button>
              {(Object.values(ProofType)).map(type => (
                <button
                  key={type}
                  onClick={() => setActiveFilter(type)}
                  className={`flex-none px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${
                    activeFilter === type 
                    ? 'bg-white text-indigo-600 shadow-sm border border-slate-100' 
                    : 'text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {type === ProofType.REVIEW ? 'Verified Reviews' : type === ProofType.TESTIMONIAL ? 'Community Stories' : type}
                </button>
              ))}
            </div>
            
            <div className="relative w-full md:flex-1">
              <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                type="text"
                placeholder="SEARCH EXPERIENCES (E.G. 'APEX', 'SIZE', 'MARATHON')..."
                className="w-full pl-12 pr-6 py-3.5 bg-slate-50/50 border border-slate-100 rounded-2xl text-[11px] font-bold uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:bg-white transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Wall of Love Masonry Grid */}
        <section className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-8 space-y-8 min-h-[600px]">
          {filteredProof.length > 0 ? (
            filteredProof.map(item => (
              <ProofCard item={item} key={item.id} />
            ))
          ) : (
            <div className="col-span-full py-40 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">No results found</h3>
              <p className="text-slate-400 font-medium max-w-xs mx-auto mt-2">Try broader keywords or different filters to see what our community thinks.</p>
            </div>
          )}
        </section>

        {/* Global CTA Section */}
        <section className="mt-40 mb-20">
          <div className="bg-slate-900 rounded-[3.5rem] p-12 md:p-32 text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500/20 to-violet-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-[0.9]">
                WHAT'S YOUR <span className="text-indigo-400 italic">FLEXY?</span>
              </h2>
              <p className="text-slate-400 text-lg md:text-xl font-medium mb-12 max-w-2xl mx-auto leading-relaxed">
                Join our Hall of Fame. Share a photo or review using #FlexyPe for a chance to be featured and win a $250 gift card every month.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <button className="px-10 py-5 bg-white text-slate-900 font-black rounded-2xl hover:bg-indigo-400 hover:text-white transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-white/5 uppercase tracking-widest text-sm">
                  Share Your Story
                </button>
                <button className="px-10 py-5 bg-white/5 text-white font-black rounded-2xl hover:bg-white/10 backdrop-blur-md transition-all duration-300 border border-white/10 uppercase tracking-widest text-sm">
                  The Story of FlexyPe
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="text-2xl font-black tracking-tighter text-slate-900 flex items-center gap-2 grayscale opacity-50">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-white rounded-sm rotate-45" />
            </div>
            FlexyPe
          </div>
          <div className="flex gap-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            <a href="#" className="hover:text-indigo-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Contact Us</a>
          </div>
          <p className="text-[11px] font-bold text-slate-300 uppercase tracking-widest">
            © 2024 FLEXYPE PERFORMANCE • AUTHENTICITY GUARANTEED
          </p>
        </div>
      </footer>
    </div>
  );
}
