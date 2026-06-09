import React, { useEffect, useRef, useState } from 'react';

export default function ScrollReveal({ children, direction = 'up', delay = 0, className = '' }) {
  const [isVisible, setIsVisible] = useState(() => false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.1, rootMargin: '50px' });

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, [ref]);

  const dirClass = 
    direction === 'up' ? 'translate-y-12' : 
    direction === 'down' ? '-translate-y-12' : 
    direction === 'left' ? '-translate-x-12' : 
    direction === 'right' ? 'translate-x-12' : '';

  return (
    <div 
      ref={ref} 
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] transform-gpu ${
        isVisible ? 'opacity-100 translate-y-0 translate-x-0' : `opacity-0 ${dirClass}`
      } ${className}`}
    >
      {children}
    </div>
  );
}
