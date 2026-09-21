import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Baby, Star, Camera, Heart, Sparkles, Video, CalendarHeart, Loader2, X, Download, Maximize2, Plus } from 'lucide-react';

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

  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // UI States for Gallery
  const [expandedMonths, setExpandedMonths] = useState({});
  const [expandedRandom, setExpandedRandom] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const colors = ['bg-blue-200', 'bg-purple-200', 'bg-pink-200', 'bg-yellow-200', 'bg-orange-200', 'bg-red-200', 'bg-green-200'];
  const heights = ['h-64', 'h-48', 'h-72', 'h-56', 'h-80', 'h-96'];
  const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];
  const getRandomHeight = () => heights[Math.floor(Math.random() * heights.length)];

  useEffect(() => {
    fetch('https://vyansh-api.mutanttechnologies.com/vyanshworldapi.php')
      .then(res => res.json())
      .then(data => {
        const processedPhotos = data.map(item => ({
          id: item.id,
          category: item.category,
          type: 'image', 
          url: `https://vyansh-api.mutanttechnologies.com/uploads/${item.filename}`,
          color: getRandomColor(),
          height: getRandomHeight(),
          title: item.filename 
        }));
        setPhotos(processedPhotos);
        setLoading(false);
      })
      .catch(error => {
        console.error('Failed to load gallery:', error);
        setLoading(false);
      });
  }, []);

  const randomMedia = photos.filter(p => p.category.includes('Random'));
  const monthPhotos = photos.filter(p => !p.category.includes('Random'));
  
  const groupedMonths = monthPhotos.reduce((acc, photo) => {
    if (!acc[photo.category]) acc[photo.category] = [];
    acc[photo.category].push(photo);
    return acc;
  }, {});

  const sortedMonthKeys = Object.keys(groupedMonths).sort((a, b) => parseInt(a) - parseInt(b));
  
  const monthlyMilestones = sortedMonthKeys.map(monthName => ({
    month: monthName,
    subtitle: `Unlocking cuteness in the ${monthName}...`,
    media: groupedMonths[monthName]
  }));

  const handleDownload = async (item) => {
    try {
      // Fetching the blob forces a true download instead of just opening in the browser
      const response = await fetch(item.url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `vyansh_${item.category}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      // Fallback if CORS blocks the blob
      window.open(item.url, '_blank');
    }
  };

  const MediaCard = ({ item, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: (index % 3) * 0.1 }}
      whileHover={{ scale: 1.03, rotate: index % 2 === 0 ? 2 : -2 }}
      onClick={() => setSelectedImage(item)}
      className={`relative rounded-3xl overflow-hidden shadow-lg border-4 border-white ${item.color} ${item.height || 'h-64'} flex items-center justify-center group cursor-pointer`}
    >
      {item.url ? (
         <img src={item.url} alt="Vyansh moment" className="w-full h-full object-cover" loading="lazy" />
      ) : (
        <div className="text-white/80 font-bold text-lg px-4 text-center flex flex-col items-center gap-2">
          <Camera size={32} />
          <span>[ Placeholder ]</span>
        </div>
      )}
      
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-6">
        <Maximize2 size={36} className="text-white mb-2" />
        <p className="text-white font-bold text-lg">Click to View</p>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 font-sans text-slate-800 overflow-hidden">
      
      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 md:p-8 backdrop-blur-md transition-opacity">
          <button 
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 md:top-8 md:right-8 text-slate-400 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all"
          >
            <X size={32} />
          </button>
          
          <img 
            src={selectedImage.url} 
            alt="Vyansh Expanded" 
            className="max-w-full max-h-[80vh] md:max-h-[85vh] object-contain rounded-lg shadow-2xl" 
          />
          
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4">
            <button 
              onClick={() => handleDownload(selectedImage)} 
              className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-full flex items-center gap-2 font-bold shadow-lg transition-transform hover:scale-105"
            >
              <Download size={20} /> Download
            </button>
            <a 
              href={selectedImage.url} 
              target="_blank" 
              rel="noreferrer" 
              className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-full flex items-center gap-2 font-bold shadow-lg transition-transform hover:scale-105"
            >
              <Maximize2 size={20} /> Full Size
            </a>
          </div>
        </div>
      )}

      {/* Background Decor */}
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
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-pink-400">
             <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, ease: "linear", duration: 1 }}>
               <Loader2 size={48} />
             </motion.div>
             <p className="mt-4 font-bold text-lg text-slate-600">Loading the cuteness archive...</p>
          </div>
        ) : photos.length === 0 ? (
          <div className="text-center py-20 bg-white/60 backdrop-blur-sm rounded-3xl shadow-xl border-4 border-white">
            <Camera size={64} className="mx-auto text-slate-300 mb-4" />
            <h2 className="text-2xl font-bold text-slate-600">The vault is empty!</h2>
            <p className="text-slate-500">Go to /admin to upload some memories.</p>
          </div>
        ) : (
          <>
            {/* Section 1: Month by Month Timeline */}
            {monthlyMilestones.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-12 justify-center">
                  <CalendarHeart className="text-pink-500" size={36} />
                  <h2 className="text-4xl font-bold text-slate-700">Growing Up Fast</h2>
                </div>

                <div className="space-y-16">
                  {monthlyMilestones.map((monthData, idx) => {
                    const isExpanded = expandedMonths[monthData.month];
                    const visibleMedia = isExpanded ? monthData.media : monthData.media.slice(0, 5);
                    const hiddenCount = monthData.media.length - 5;

                    return (
                      <div key={idx} className="relative">
                        <div className="hidden md:block absolute left-8 top-16 bottom-[-4rem] w-1 bg-gradient-to-b from-pink-300 to-blue-300 opacity-50 z-0"></div>
                        
                        <div className="relative z-10 md:pl-24">
                          <div className="hidden md:flex absolute left-0 top-0 w-16 h-16 bg-white rounded-full border-4 border-pink-300 items-center justify-center shadow-md">
                            <Star className="text-yellow-400 fill-yellow-400" size={24} />
                          </div>
                          
                          <h3 className="text-3xl font-extrabold text-slate-700 mb-2">{monthData.month}</h3>
                          <p className="text-lg text-slate-500 mb-6 font-medium">{monthData.subtitle} ({monthData.media.length} photos)</p>
                          
                          <div className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6">
                            {visibleMedia.map((item, index) => (
                              <div key={item.id} className="break-inside-avoid">
                                <MediaCard item={item} index={index} />
                              </div>
                            ))}
                          </div>
                          
                          {/* Load More Button */}
                          {!isExpanded && hiddenCount > 0 && (
                            <div className="mt-8 text-center">
                              <button 
                                onClick={() => setExpandedMonths(prev => ({...prev, [monthData.month]: true}))}
                                className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-pink-500 border-2 border-pink-200 px-8 py-3 rounded-full font-bold shadow-sm hover:shadow-md transition-all"
                              >
                                <Plus size={20} /> View {hiddenCount} more memories
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Section 2: Random Moments */}
            {randomMedia.length > 0 && (
              <section className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl border-4 border-white mt-16">
                <div className="flex items-center justify-center gap-3 mb-10">
                  <Camera className="text-purple-500" size={32} />
                  <h2 className="text-3xl md:text-4xl font-bold text-slate-700">Random Mischief</h2>
                </div>

                <div className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6">
                  {(expandedRandom ? randomMedia : randomMedia.slice(0, 5)).map((item, index) => (
                    <div key={item.id} className="break-inside-avoid">
                      <MediaCard item={item} index={index} />
                    </div>
                  ))}
                </div>

                {!expandedRandom && randomMedia.length > 5 && (
                  <div className="mt-8 text-center">
                    <button 
                      onClick={() => setExpandedRandom(true)}
                      className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-purple-500 border-2 border-purple-200 px-8 py-3 rounded-full font-bold shadow-sm hover:shadow-md transition-all"
                    >
                      <Plus size={20} /> View {randomMedia.length - 5} more memories
                    </button>
                  </div>
                )}
              </section>
            )}
          </>
        )}

      </main>

      <footer className="text-center py-12 text-slate-500">
        <p>Made with ❤️ for Vyansh.</p>
        <p className="text-sm mt-2">Currently digesting milk and rendering HTML.</p>
      </footer>
    </div>
  );
}

export default Home;
