import React from 'react';

interface SectionHeadingProps {
  kicker?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  dark?: boolean;
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  kicker,
  title,
  subtitle,
  centered = false,
  dark = false,
  className = '',
}) => {
  return (
    <div
      className={`mb-12 md:mb-16 ${centered ? 'text-center mx-auto max-w-3xl' : 'max-w-2xl'} ${className}`}
    >
      {kicker && (
        <p
          className={`text-xs font-semibold uppercase tracking-widest mb-3 ${
            dark ? 'text-[#C7E7A1]' : 'text-[#7DAA65]'
          }`}
        >
          {kicker}
        </p>
      )}
      <h2
        className={`font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight leading-[1.15] ${
          dark ? 'text-[#F7F7EF]' : 'text-[#173F35]'
        }`}
        style={{ textWrap: 'balance' }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-4 text-base sm:text-lg leading-relaxed ${
            dark ? 'text-stone-300' : 'text-[#737D73]'
          }`}
          style={{ textWrap: 'balance' }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};
