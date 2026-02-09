import React from 'react';
import { RadarData } from '../types';

interface RadarChartProps {
  data: RadarData[];
  width?: number;
  height?: number;
  isBlended?: boolean;
}

const RadarChart: React.FC<RadarChartProps> = ({ data, width = 300, height = 300, isBlended = false }) => {
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(centerX, centerY) - 40; // Padding
  const angleSlice = (Math.PI * 2) / data.length;

  const getCoordinates = (value: number, index: number) => {
    // - Math.PI / 2 to start from top
    const angle = index * angleSlice - Math.PI / 2;
    return {
      x: centerX + (radius * (value / 100)) * Math.cos(angle),
      y: centerY + (radius * (value / 100)) * Math.sin(angle)
    };
  };

  // Build polygon points
  const pointsSelf = data.map((d, i) => {
    const coords = getCoordinates(d.value, i);
    return `${coords.x},${coords.y}`;
  }).join(' ');

  const pointsOthers = isBlended ? data.map((d, i) => {
    const val = d.secondaryValue || 0;
    const coords = getCoordinates(val, i);
    return `${coords.x},${coords.y}`;
  }).join(' ') : '';

  // Axis lines and labels
  const axisElements = data.map((d, i) => {
    const angle = i * angleSlice - Math.PI / 2;
    const endX = centerX + radius * Math.cos(angle);
    const endY = centerY + radius * Math.sin(angle);
    
    // Label position (slightly further out)
    const labelX = centerX + (radius + 25) * Math.cos(angle);
    const labelY = centerY + (radius + 25) * Math.sin(angle);

    return (
      <g key={`axis-${i}`}>
        <line x1={centerX} y1={centerY} x2={endX} y2={endY} stroke="#E5E5E5" strokeWidth="1" />
        <text 
          x={labelX} 
          y={labelY} 
          textAnchor="middle" 
          dominantBaseline="middle" 
          className="text-[10px] fill-gray-400 font-sans tracking-wide"
        >
          {d.axis}
        </text>
      </g>
    );
  });

  // Web rings (background grid)
  const rings = [25, 50, 75, 100].map((r, i) => (
    <circle 
      key={`ring-${i}`} 
      cx={centerX} 
      cy={centerY} 
      r={radius * (r / 100)} 
      fill="none" 
      stroke="#F5F5F5" 
      strokeWidth="1" 
    />
  ));

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      <defs>
        <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF8F70" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#FF5D8D" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <g>
        {rings}
        {axisElements}
        
        {/* Others / Blended Layer (Dashed) */}
        {isBlended && (
          <polygon 
            points={pointsOthers} 
            fill="none" 
            stroke="#1A1A1A" 
            strokeWidth="1.5" 
            strokeDasharray="4 3"
            className="opacity-60"
          />
        )}

        {/* Self Layer (Solid) */}
        <polygon 
          points={pointsSelf} 
          fill="url(#radarGradient)" 
          stroke="#FF5D8D" 
          strokeWidth="2" 
        />
        
        {/* Dots for Self */}
        {data.map((d, i) => {
          const coords = getCoordinates(d.value, i);
          return <circle key={`dot-self-${i}`} cx={coords.x} cy={coords.y} r="3" fill="#FF5D8D" />;
        })}

        {/* Dots for Others (Blended only) */}
        {isBlended && data.map((d, i) => {
          const val = d.secondaryValue || 0;
          const coords = getCoordinates(val, i);
          return <circle key={`dot-other-${i}`} cx={coords.x} cy={coords.y} r="3" fill="#1A1A1A" className="opacity-60" />;
        })}

      </g>
    </svg>
  );
};

export default RadarChart;