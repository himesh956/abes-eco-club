import React, { useState } from 'react';
import { Leaf } from 'lucide-react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackText?: string;
  className?: string;
  containerClassName?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  fallbackText,
  className = '',
  containerClassName = '',
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={`relative overflow-hidden bg-[#F7F7EF] ${containerClassName}`}>
      {/* Loading & fallback backdrop */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#F7F7EF] animate-pulse">
          <Leaf className="w-8 h-8 text-[#7DAA65]/40 animate-bounce" />
        </div>
      )}

      {hasError ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#244F3D] to-[#173F35] text-white">
          <div className="w-12 h-12 rounded-full bg-[#7DAA65]/20 border border-[#7DAA65]/40 flex items-center justify-center mb-3">
            <Leaf className="w-6 h-6 text-[#C7E7A1]" />
          </div>
          <span className="text-sm font-medium tracking-wide text-[#C7E7A1]">
            {fallbackText || alt || 'Eco Club Archive'}
          </span>
          <span className="text-xs text-stone-300 mt-1 max-w-[200px] opacity-80">
            Botanical Stewardship & Field Action
          </span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt || 'Eco Club Photograph'}
          referrerPolicy="no-referrer"
          loading="lazy"
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setHasError(true);
            setIsLoading(false);
          }}
          className={`transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'} ${className}`}
          {...props}
        />
      )}
    </div>
  );
};
