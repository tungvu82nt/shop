import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  placeholderSrc?: string;
  lazyLoad?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * Component hình ảnh tối ưu với lazy loading và placeholder
 */
const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
  placeholderSrc = '/placeholder.svg',
  lazyLoad = true,
  onLoad,
  onError,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Reset state khi src thay đổi
    setIsLoaded(false);
    setError(false);
    
    if (!lazyLoad) return;
    
    // Khởi tạo IntersectionObserver cho lazy loading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && imgRef.current) {
            // Khi element nằm trong viewport, load hình ảnh
            imgRef.current.src = src;
            // Ngừng theo dõi element này
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '200px', // Preload trước 200px
        threshold: 0.01
      }
    );
    
    if (imgRef.current) {
      observer.observe(imgRef.current);
    }
    
    observerRef.current = observer;
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [src, lazyLoad]);
  
  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };
  
  const handleError = () => {
    setError(true);
    onError?.();
  };

  return (
    <div 
      className={cn(
        'relative overflow-hidden bg-gray-100',
        className
      )}
      style={{ width, height }}
    >
      <img
        ref={imgRef}
        src={lazyLoad ? placeholderSrc : src}
        alt={alt}
        width={width}
        height={height}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          'w-full h-full object-cover transition-opacity duration-300',
          isLoaded ? 'opacity-100' : 'opacity-0',
          error ? 'hidden' : 'block'
        )}
        {...props}
      />
      
      {/* Placeholder */}
      {(!isLoaded || error) && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          {error ? (
            <div className="text-gray-400 text-sm">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="mx-auto mb-1"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
              <span>Không thể tải ảnh</span>
            </div>
          ) : (
            <img 
              src={placeholderSrc} 
              alt="Loading"
              className="w-full h-full object-cover"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;