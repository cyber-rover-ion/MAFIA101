import React, { useState, useRef } from 'react';

const MagneticDock = ({ items = [] }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const dockRef = useRef(null);

  const handleMouseMove = (e, index) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  const getScale = (index) => {
    if (hoveredIndex === null) return 1;
    if (index === hoveredIndex) return 1.25;
    if (Math.abs(index - hoveredIndex) === 1) return 1.1;
    return 1;
  };

  return (
    <nav 
      aria-label="Quick Actions"
      className="flex justify-center w-full my-2"
      ref={dockRef}
    >
      <div 
        className="flex items-center gap-3 px-4 py-2.5 bg-[#0D0D13]/85 backdrop-blur-2xl border border-white/10 rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.8),0_0_20px_rgba(139,92,255,0.12)]"
        onMouseLeave={handleMouseLeave}
      >
        {items.map((item, index) => {
          const scale = getScale(index);
          const isHovered = hoveredIndex === index;
          
          return (
            <div key={index} className="relative flex flex-col items-center">
              {/* Neon Tooltip */}
              <div 
                className={`absolute -top-9 px-2.5 py-1 text-[11px] font-semibold tracking-wider bg-[#12121A] border border-[#FF1744]/40 text-[#F5F5F7] rounded-md shadow-[0_0_12px_rgba(255,23,68,0.3)] pointer-events-none transition-all duration-200 ${
                  isHovered ? 'opacity-100 -translate-y-1' : 'opacity-0 translate-y-1'
                }`}
              >
                {item.label}
              </div>

              <button
                onClick={item.onClick}
                disabled={item.disabled}
                onMouseMove={(e) => handleMouseMove(e, index)}
                className={`
                  relative flex items-center justify-center w-11 h-11 rounded-full
                  transition-all duration-200 ease-out origin-bottom
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF1744]
                  ${item.active ? 'text-[#FF1744]' : 'text-[#8E8E98] hover:text-[#F5F5F7]'}
                  ${item.disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                `}
                style={{
                  transform: `scale(${scale}) translateY(${scale > 1 ? -6 * (scale - 1) : 0}px)`,
                  zIndex: isHovered ? 10 : 1
                }}
                aria-label={item.label}
              >
                <div className={`flex items-center justify-center w-full h-full rounded-full transition-all duration-200 ${
                  isHovered 
                    ? 'bg-[#181824] border border-[#FF1744]/50 shadow-[0_0_14px_rgba(255,23,68,0.35)] text-white' 
                    : 'bg-[#12121A] border border-white/5 text-[#8E8E98]'
                }`}>
                  {item.icon}
                </div>

                {item.active && (
                  <div className="absolute -bottom-1 w-1.5 h-1.5 bg-[#FF1744] rounded-full shadow-[0_0_10px_#FF1744]" />
                )}
              </button>
            </div>
          );
        })}
      </div>
    </nav>
  );
};

export default MagneticDock;
