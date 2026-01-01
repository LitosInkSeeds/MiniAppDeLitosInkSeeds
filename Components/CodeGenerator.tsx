import React, { useState, useEffect } from 'react';
import { Moon, Sun, Briefcase, Sparkles, Dumbbell } from 'lucide-react';

interface CosmicClockProps {
  size?: number;
  showLabels?: boolean; // Kept for backward compatibility, but layout is now fixed
}

export const CosmicClock: React.FC<CosmicClockProps> = ({ size = 300 }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // --- MATH HELPERS ---
  
  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  // --- SECTORS CONFIG (24h Clock) ---
  // Top (12:00) = 0 degrees (visual)
  // Bottom (00:00) = 180 degrees
  // 24 hours = 360 degrees.
  // Formula: Angle = (Hours / 24) * 360 + 180 (so 0h is at bottom)
  
  const getAngle = (h: number) => {
      // 0h -> 180 deg (Bottom)
      // 6h -> 270 deg (Left)
      // 12h -> 360/0 deg (Top)
      // 18h -> 90 deg (Right)
      return (h / 24) * 360 + 180;
  };

  // 4 Identical Blocks of 6 hours each
  const sectors = [
    { 
        id: 'body',
        color: '#e2e8f0', // White/Grey
        start: 3, 
        end: 9,   // Covers 06:00 (Left)
        icon: <Dumbbell size={16} className="text-slate-600" />
    },
    { 
        id: 'work',
        color: '#ef4444', // Red
        start: 9, 
        end: 15,  // Covers 12:00 (Top)
        icon: <Sun size={16} className="text-red-100" />
    },
    { 
        id: 'spirit',
        color: '#eab308', // Yellow
        start: 15, 
        end: 21,  // Covers 18:00 (Right)
        icon: <Sparkles size={16} className="text-yellow-100" />
    },
    { 
        id: 'sleep',
        color: '#3b82f6', // Blue
        start: 21, 
        end: 3,   // Covers 00:00 (Bottom)
        icon: <Moon size={16} className="text-blue-100" />
    }
  ];

  // Current Needle Angle
  const currentHours = time.getHours() + time.getMinutes() / 60 + time.getSeconds() / 3600;
  const needleAngle = getAngle(currentHours);

  // Layout Dimensions
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.4; // Radius (slightly smaller to fit text)
  const strokeW = size * 0.15; // Sector thickness
  const textRadius = r + (size * 0.12); // Position for Noon/Midnight text

  return (
    <div className="flex flex-col items-center justify-center relative select-none">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        
        {/* Background Circle */}
        <circle cx={cx} cy={cy} r={r} fill="#0f172a" stroke="none" />

        {/* Sectors */}
        {sectors.map((sector, i) => {
          let startAng = getAngle(sector.start);
          let endAng = getAngle(sector.end);
          
          // SVG Arc Logic
          // We calculate the path for the stroke itself
          const arcRadius = r - (strokeW / 2); // Center of the stroke
          
          const start = polarToCartesian(cx, cy, arcRadius, endAng); // Draw backwards (counter-clockwise visual) or check angles
          const end = polarToCartesian(cx, cy, arcRadius, startAng);
          
          // Since we are doing specific 90 degree quadrants (6h), largeArc is always 0
          const d = [
            "M", start.x, start.y,
            "A", arcRadius, arcRadius, 0, 0, 0, end.x, end.y
          ].join(" ");

          // Calculate Icon Position (Midpoint)
          let midH = (sector.start + sector.end) / 2;
          if (sector.id === 'sleep') midH = 0; // Special case for wrap around math simplicity
          const midAng = getAngle(midH);
          const iconPos = polarToCartesian(cx, cy, r - (strokeW/2), midAng);

          return (
            <g key={i}>
                <path 
                    d={d} 
                    fill="none" 
                    stroke={sector.color} 
                    strokeWidth={strokeW} 
                    strokeLinecap="butt"
                    className="opacity-90"
                />
                
                {/* Sector Icon */}
                <foreignObject 
                    x={iconPos.x - 10} 
                    y={iconPos.y - 10} 
                    width="20" 
                    height="20"
                    style={{ overflow: 'visible' }}
                >
                    <div className="flex items-center justify-center w-full h-full drop-shadow-md">
                        {sector.icon}
                    </div>
                </foreignObject>
            </g>
          );
        })}

        {/* Text Labels */}
        <text 
            x={cx} 
            y={cy - textRadius} 
            textAnchor="middle" 
            dominantBaseline="middle"
            fill="#94a3b8" 
            fontSize={size * 0.05} 
            fontWeight="bold" 
            letterSpacing="2px"
            className="uppercase"
        >
            Mediodía
        </text>

        <text 
            x={cx} 
            y={cy + textRadius} 
            textAnchor="middle" 
            dominantBaseline="middle"
            fill="#94a3b8" 
            fontSize={size * 0.05} 
            fontWeight="bold" 
            letterSpacing="2px"
            className="uppercase"
        >
            Medianoche
        </text>

        {/* Center Pivot */}
        <circle cx={cx} cy={cy} r={6} fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
        
        {/* Mono Needle */}
        <line
            x1={cx}
            y1={cy}
            x2={polarToCartesian(cx, cy, r - 5, needleAngle).x}
            y2={polarToCartesian(cx, cy, r - 5, needleAngle).y}
            stroke="#ffffff"
            strokeWidth="4"
            strokeLinecap="round"
            className="drop-shadow-[0_0_4px_rgba(255,255,255,0.5)]"
        />
        
        {/* Needle Tip */}
        <circle 
            cx={polarToCartesian(cx, cy, r, needleAngle).x} 
            cy={polarToCartesian(cx, cy, r, needleAngle).y} 
            r={4} 
            fill="#ffffff"
        />

      </svg>
    </div>
  );
};
