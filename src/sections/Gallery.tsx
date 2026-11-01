import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, MapPin, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SectionHeading } from '../components/SectionHeading';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { galleryItems } from '../data/gallery';
import { GalleryItem } from '../types';

export const Gallery: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categories = [
    'All',
    'Plantation',
    'Cleanliness Drives',
    'Awareness Campaigns',
    'Workshops',
    'Campus Activities',
  ];

  const filteredItems =
    selectedCategory === 'All'
      ? galleryItems
      : galleryItems.filter((item) => item.category === selectedCategory);

  const currentLightboxItem: GalleryItem | null =
    lightboxIndex !== null ? filteredItems[lightboxIndex] || null : null;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => (prev! > 0 ? prev! - 1 : filteredItems.length - 1));
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => (prev! < filteredItems.length - 1 ? prev! + 1 : 0));
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev! > 0 ? prev! - 1 : filteredItems.length - 1));
      }
      if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev! < filteredItems.length - 1 ? prev! + 1 : 0));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, filteredItems.length]);

  return (
    <section id="gallery" className="py-24 bg-[#FCFCF8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <SectionHeading
          kicker="Visual Chronicle"
          title="Campus Greenery & Fieldwork"
          subtitle="Explore photographs documenting tree planting, riverbank clearings, zero-waste workshops, and student advocacy across campus."
        />

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#173F35] text-white shadow-sm'
                  : 'bg-[#F7F7EF] text-[#737D73] hover:text-[#173F35] hover:bg-stone-200/70 border border-stone-200/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3 }}
              className="group relative rounded-2xl overflow-hidden bg-stone-100 cursor-pointer shadow-sm hover:shadow-lg border border-stone-200/80 aspect-4/3"
              onClick={() => setLightboxIndex(index)}
            >
              <ImageWithFallback
                src={item.imageUrl}
                alt={item.title}
                fallbackText={item.title}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                containerClassName="w-full h-full"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#173F35]/90 via-[#173F35]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-5 flex flex-col justify-end text-white">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#C7E7A1]">
                  {item.category}
                </span>
                <h4 className="font-serif text-base font-semibold leading-snug mt-1">
                  {item.title}
                </h4>
                <div className="flex items-center gap-3 text-xs text-stone-200 mt-2">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#C7E7A1]" /> {item.location}
                  </span>
                  <span>·</span>
                  <span>{item.date}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {currentLightboxItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#173F35]/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
            onClick={() => setLightboxIndex(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer z-10"
              aria-label="Close Lightbox"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Prev Button */}
            <button
              onClick={handlePrev}
              className="absolute left-4 sm:left-8 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Next Button */}
            <button
              onClick={handleNext}
              className="absolute right-4 sm:right-8 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer z-10"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Lightbox Content Container */}
            <div
              className="relative max-w-4xl w-full bg-[#FCFCF8] rounded-2xl overflow-hidden shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-16/9 w-full bg-black overflow-hidden max-h-[65vh]">
                <ImageWithFallback
                  src={currentLightboxItem.imageUrl}
                  alt={currentLightboxItem.title}
                  className="w-full h-full object-contain"
                  containerClassName="w-full h-full"
                />
              </div>

              <div className="p-6 bg-[#FCFCF8]">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#7DAA65]">
                    {currentLightboxItem.category}
                  </span>
                  <div className="flex items-center gap-4 text-xs text-[#737D73]">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {currentLightboxItem.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {currentLightboxItem.location}
                    </span>
                  </div>
                </div>

                <h3 className="font-serif text-2xl font-semibold text-[#173F35] mb-2">
                  {currentLightboxItem.title}
                </h3>
                <p className="text-sm text-[#202C25] leading-relaxed">
                  {currentLightboxItem.caption}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
