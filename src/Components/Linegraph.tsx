import React, { useState } from 'react';
import './LineGraph.css'; // Import your CSS file

interface LineGraphProps {
  data: number[]; // Array of float elements
}

const LineGraph: React.FC<LineGraphProps> = ({ data }) => {
  // Calculate max value to scale the graph
  const maxValue = Math.max(...data);

  // State to track hovered point and its coordinates
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  // Function to calculate Y-coordinate based on value
  const calculateY = (value: number) => {
    const percent = (value / maxValue) * 100;
    return 100 - percent; // Reverse for vertical orientation
  };

  // Function to generate line path
  const generatePath = () => {
    let path = `M 0 ${calculateY(data[0])}`;

    data.forEach((value, index) => {
      const x = (index / (data.length - 1)) * 100; // X-coordinate
      const y = calculateY(value); // Y-coordinate
      path += ` L ${x} ${y}`;
    });

    return path;
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLElement>) => {
    const svg = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - svg.left) / svg.width * 100;
  
    setHoveredPoint(x);
  };

  const handleMouseLeave = () => {
    setHoveredPoint(null);
  };

  return (
    <div className="line-graph-container" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      <svg viewBox="0 0 100 100" className="line-graph-svg">
        <path d={generatePath()} className="line-graph-path" />
        {hoveredPoint !== null && (
          <>
            <line x1={hoveredPoint} y1="0" x2={hoveredPoint} y2="100" className="hover-line" />
            <text x={hoveredPoint + 1} y="5" className="hover-label">
              {data[Math.round((hoveredPoint / 100) * (data.length - 1))].toFixed(2)}
            </text>
          </>
        )}
      </svg>
    </div>
  );
};

export default LineGraph;
