import React from 'react';
import { motion } from 'framer-motion';
import { Baby, Star, Camera, Heart, Sparkles, Video, CalendarHeart } from 'lucide-react';

function Home() {
  const birthDate = new Date('2026-04-21'); 
  
  const getDynamicAge = () => {
    const today = new Date();
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    
    if (months < 0) {
      years--;
      months += 12;
    }
    
    if (years === 0) {
      return `${months} months in`;
    } else if (years === 1) {
      return `1 year${months > 0 ? ` and ${months} months` : ''} in`;
    } else {
      return `${years} years${months > 0 ? ` and ${months} months` : ''} in`;
    }
  };

  // Structured data for the month-by-month timeline
  const monthlyMilestones = [
    {
      month: "1st Month",
      subtitle: "Hello World! Mostly sleeping and eating.",
      media: [
        { id: 101, type: "image", color: "bg-blue-200" },
        { id: 102, type: "image", color: "bg-purple-200" },
      ]
    },
    {
      month: "2nd Month",
      subtitle: "First real smiles (or was it just gas?).",
      media: [
        { id: 201, type: "image", color: "bg-pink-200" },
        { id: 202, type: "video", color: "bg-rose-200", title: "Baby Noises" },
      ]
    },
    {
      month: "5th Month",
      subtitle: "Rolling over and demanding attention 24/7.",
      media: [
        { id: 501, type: "image", color: "bg-yellow-200" },
        { id: 502, type: "image", color: "bg-orange-200" },
        { id: 503, type: "video", color: "bg-red-200", title: "Trying to crawl" },
      ]
    }
  ];

  // Random uncategorized photos and videos
  const randomMedia = [
    { id: 1, type: "image", title: "The 'I just woke up at 3 AM' face", height: "h-64", color: "bg-blue-300" },
    { id: 2, type: "video", title: "Uncontrollable Giggles", height: "h-48", color: "bg-pink-300" },
    { id: 3, type: "image", title: "Discovering toes", height: "h-72", color: "bg-yellow-300" },
    { id: 4, type: "image", title: "Plotting world domination", height: "h-56", color: "bg-purple-300" },
    { id: 5, type: "video", title: "Bath time splashes", height: "h-64", color: "bg-green-300" },
  ];

  // Reusable component for the media cards to keep code clean
  const MediaCard = ({ item, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: (index % 3) * 0.1 }}
      whileHover={{ scale: 1.03, rotate: index % 2 === 0 ? 2 : -2 }}
      className={`relative rounded-3xl overflow-hidden shadow-lg border-4 border-white ${item.color} ${item.height || 'h-64'} flex items-center justify-center group cursor-pointer`}
    >
      <div className="text-white/80 font-bold text-lg px-4 text-center flex flex-col items-center gap-2">
        {item.type === 'video' ? <Video size={32} /> : <Camera size={32} />}
        <span>[ {item.type === 'video' ? 'Video' : 'Photo'} Placeholder ]</span>
      </div>
      
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
        <p className="text-white font-bold text-lg flex items-center gap-2">
          {item.type === 'video' ? <Video size={20} className="text-yellow-300" /> : <Heart size={20} className="text-pink-400 fill-pink-400" />}
          {item.title || "Cute moment"}
        </p>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 font-sans text-slate-800 overflow-hidden">
      
      <div className="absolute top-10 left-10 text-yellow-400 opacity-50">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 10, ease: "linear" }}><Star size={40} /></motion.div>
      </div>
      <div className="absolute top-40 right-20 text-blue-300 opacity-50">
        <motion.div animate={{ y: [0, -20, 0] }} transition={{ repeat: Infinity, duration: 3 }}><Sparkles size={50} /></motion.div>
      </div>

      <header className="relative pt-20 pb-16 text-center px-4">
        <motion.div 
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="inline-block bg-white p-6 rounded-full shadow-xl mb-6 border-4 border-yellow-300"
        >
          <Baby size={80} className="text-pink-400" />
        </motion.div>
        <motion.h1 
          initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 mb-4 tracking-tight"
        >
          Welcome to Vyansh's World!
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto font-medium"
        >
          {getDynamicAge()}, and I already run this place. <br/> (Just ask my parents).
        </motion.p>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 relative z-10 space-y-24">
        
        {/* Section 1: Month by Month Timeline */}
        <section>
          <div className="flex items-center gap-3 mb-12 justify-center">
            <CalendarHeart className="text-pink-500" size={36} />
            <h2 className="text-4xl font-bold text-slate-700">Growing Up Fast</h2>
          </div>

          <div className="space-y-16">
            {monthlyMilestones.map((monthData, idx) => (
              <div key={idx} className="relative">
                {/* Timeline Line (Desktop only) */}
                <div className="hidden md:block absolute left-8 top-16 bottom-[-4rem] w-1 bg-gradient-to-b from-pink-300 to-blue-300 opacity-50 z-0"></div>
                
                <div className="relative z-10 md:pl-24">
                  {/* Month Marker */}
                  <div className="hidden md:flex absolute left-0 top-0 w-16 h-16 bg-white rounded-full border-4 border-pink-300 items-center justify-center shadow-md">
                    <Star className="text-yellow-400 fill-yellow-400" size={24} />
                  </div>
                  
                  <h3 className="text-3xl font-extrabold text-slate-700 mb-2">{monthData.month}</h3>
                  <p className="text-lg text-slate-500 mb-6 font-medium">{monthData.subtitle}</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {monthData.media.map((item, index) => (
                      <MediaCard key={item.id} item={item} index={index} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Random Moments & Videos */}
        <section className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl border-4 border-white">
          <div className="flex items-center justify-center gap-3 mb-10">
            <Camera className="text-purple-500" size={32} />
            <h2 className="text-3xl md:text-4xl font-bold text-slate-700">Random Mischief & Videos</h2>
          </div>

          <div className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6">
            {randomMedia.map((item, index) => (
              <MediaCard key={item.id} item={item} index={index} />
            ))}
          </div>
        </section>

      </main>

      <footer className="text-center py-12 text-slate-500">
        <p>Made with ❤️ for Vyansh.</p>
        <p className="text-sm mt-2">Currently digesting milk and rendering HTML.</p>
      </footer>
    </div>
  );
}

export default Home;
