import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Banner } from '../types';
import { storage } from '../utils/storage';

interface BannerScrollerProps {
  onBannerClick: (affiliateUrl: string) => void;
}

export function BannerScroller({ onBannerClick }: BannerScrollerProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [banners, setBanners] = useState<Banner[]>([]);

  useEffect(() => {
    const loadBanners = async () => {
      const data = await storage.getBanners();
      setBanners(data.filter((banner: Banner) => banner.isActive));
    };
    loadBanners();
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleBannerClick = (banner: Banner) => {
    onBannerClick(banner.affiliateUrl);
  };

  if (banners.length === 0) {
    return (
      <div className="w-full h-64 bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center">
        <div className="text-center text-gray-600">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-lg flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-lg font-medium">No active banners</p>
          <p className="text-sm mt-1">Add banners in admin panel to display here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-64 md:h-80 overflow-hidden bg-gray-100">
      {/* Banner Container */}
      <div 
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {banners.map((banner) => (
          <div
            key={banner.id}
            className="w-full flex-shrink-0 relative cursor-pointer group"
            onClick={() => handleBannerClick(banner)}
          >
            {banner.imageUrl ? (
              <img
                src={banner.imageUrl}
                alt={banner.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/800x300';
                }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
                <div className="text-center text-white">
                  <h3 className="text-2xl font-bold mb-2">{banner.title}</h3>
                  <p className="text-lg opacity-90">Click to view sale</p>
                </div>
              </div>
            )}
            
            {/* Overlay with banner info */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-xl font-bold mb-2">{banner.title}</h3>
                <p className="text-sm opacity-90">Click to view sale</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-colors"
            aria-label="Previous banner"
          >
            <ChevronLeft className="w-5 h-5 text-gray-800" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-colors"
            aria-label="Next banner"
          >
            <ChevronRight className="w-5 h-5 text-gray-800" />
          </button>
        </>
      )}

      {/* Slide Indicators */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                currentSlide === index
                  ? 'bg-white w-8'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}