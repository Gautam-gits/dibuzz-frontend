import React, { useRef, useEffect } from 'react';
import { designTokens } from './design-tokens';

/**
 * Chart Components
 * Unified chart components using Canvas API (no external dependencies)
 */

const defaultColors = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
  '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1',
];

const chartDefaults = {
  responsive: true,
  maintainAspectRatio: true,
  animation: {
    duration: 750,
    easing: 'easeOutQuart',
  },
  plugins: {
    legend: {
      display: true,
      position: 'bottom',
      labels: {
        usePointStyle: true,
        padding: 20,
        font: { size: 12, family: 'Plus Jakarta Sans' },
        color: '#475569',
      },
    },
    tooltip: {
      backgroundColor: 'rgba(15, 23, 42, 0.9)',
      titleFont: { size: 13, family: 'Plus Jakarta Sans', weight: '600' },
      bodyFont: { size: 12, family: 'Plus Jakarta Sans' },
      padding: 12,
      cornerRadius: 8,
      displayColors: true,
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: '#94A3B8', font: { size: 11, family: 'Plus Jakarta Sans' } },
    },
    y: {
      beginAtZero: true,
      grid: { color: '#E2E8F0', drawBorder: false },
      ticks: { color: '#94A3B8', font: { size: 11, family: 'Plus Jakarta Sans' } },
    },
  },
};

function mergeDeep(target, source) {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    if (source[key] instanceof Object && key in target) {
      result[key] = mergeDeep(target[key], source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
}

function getContrastColor(hex) {
  const rgb = parseInt(hex.replace('#', ''), 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  return luminance > 128 ? '#1E293B' : '#FFFFFF';
}

export function BarChart({
  data,
  options = {},
  width = 400,
  height = 300,
  colors = defaultColors,
  className = '',
}) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const mergedOptions = mergeDeep({ ...chartDefaults }, options);
    const labels = data.labels || [];
    const datasets = data.datasets || [];

    // Animation
    let progress = 0;
    const animate = () => {
      progress = Math.min(progress + 0.02, 1);
      drawChart(ctx, progress);
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    const drawChart = (ctx, progress) => {
      ctx.clearRect(0, 0, width, height);

      const padding = { top: 20, right: 20, bottom: 60, left: 60 };
      const chartWidth = width - padding.left - padding.right;
      const chartHeight = height - padding.top - padding.bottom;

      const maxValue = Math.max(...datasets.flatMap(d => d.data));
      const barWidth = chartWidth / (labels.length * datasets.length + datasets.length - 1);
      const groupWidth = barWidth * datasets.length;

      // Draw Y axis
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 1;
      ctx.font = '11px "Plus Jakarta Sans"';
      ctx.fillStyle = '#94A3B8';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';

      const ySteps = 5;
      for (let i = 0; i <= ySteps; i++) {
        const y = padding.top + (chartHeight / ySteps) * i;
        const value = maxValue * (1 - i / ySteps);
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(width - padding.right, y);
        ctx.stroke();
        ctx.fillText(formatNumber(value), padding.left - 10, y);
      }

      // Draw bars
      datasets.forEach((dataset, dsIndex) => {
        ctx.fillStyle = dataset.backgroundColor || colors[dsIndex % colors.length];
        ctx.strokeStyle = dataset.borderColor || colors[dsIndex % colors.length];
        ctx.lineWidth = 1;

        dataset.data.forEach((value, index) => {
          const x = padding.left + index * groupWidth + dsIndex * barWidth + (dsIndex * 2);
          const barHeight = (value / maxValue) * chartHeight * progress;
          const y = padding.top + chartHeight - barHeight;

          // Rounded bar
          const radius = 4;
          ctx.beginPath();
          ctx.moveTo(x + radius, y);
          ctx.lineTo(x + barWidth - radius, y);
          ctx.quadraticCurveTo(x + barWidth, y, x + barWidth, y + radius);
          ctx.lineTo(x + barWidth, y + barHeight);
          ctx.quadraticCurveTo(x + barWidth, y + barHeight + radius, x + barWidth - radius, y + barHeight);
          ctx.lineTo(x + radius, y + barHeight);
          ctx.quadraticCurveTo(x, y + barHeight, x, y + barHeight - radius);
          ctx.lineTo(x, y + radius);
          ctx.quadraticCurveTo(x, y, x + radius, y);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        });
      });

      // Draw X axis labels
      ctx.fillStyle = '#94A3B8';
      ctx.font = '11px "Plus Jakarta Sans"';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      labels.forEach((label, index) => {
        const x = padding.left + index * groupWidth + groupWidth / 2;
        ctx.fillText(label, x, height - padding.bottom + 10);
      });
    };

    animate();
    return () => cancelAnimationFrame(animationRef.current);
  }, [data, options, width, height, colors]);

  function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  }

  return (
    <div className={className} style={{ position: 'relative', width, height }}>
      <canvas ref={canvasRef} width={width} height={height} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}

export function LineChart({
  data,
  options = {},
  width = 400,
  height = 300,
  colors = defaultColors,
  className = '',
  fill = true,
  tension = 0.3,
}) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const mergedOptions = mergeDeep({ ...chartDefaults }, options);
    const labels = data.labels || [];
    const datasets = data.datasets || [];

    let progress = 0;
    const animate = () => {
      progress = Math.min(progress + 0.015, 1);
      drawChart(ctx, progress);
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    const drawChart = (ctx, progress) => {
      ctx.clearRect(0, 0, width, height);

      const padding = { top: 20, right: 20, bottom: 60, left: 60 };
      const chartWidth = width - padding.left - padding.right;
      const chartHeight = height - padding.top - padding.bottom;

      const allData = datasets.flatMap(d => d.data);
      const maxValue = Math.max(...allData, 0);
      const minValue = Math.min(...allData, 0);

      // Draw grid
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 1;
      ctx.font = '11px "Plus Jakarta Sans"';
      ctx.fillStyle = '#94A3B8';

      const ySteps = 5;
      for (let i = 0; i <= ySteps; i++) {
        const y = padding.top + (height - padding.top - padding.bottom) / ySteps * i;
        const value = maxValue * (1 - i / ySteps);
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(width - padding.right, y);
        ctx.stroke();
        ctx.fillStyle = '#94A3B8';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText(formatNumber(maxValue * (1 - i / ySteps)), padding.left - 10, y);
      }

      // Draw lines
      datasets.forEach((dataset, dsIndex) => {
        const color = dataset.borderColor || colors[dsIndex % colors.length];
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();
        dataset.data.forEach((value, index) => {
          const x = padding.left + (index / (labels.length - 1)) * (width - padding.left - padding.right);
          const y = padding.top + (height - padding.top - padding.bottom) * (1 - (value / maxValue)) * progress;
          if (index === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.stroke();

        // Fill area
        if (fill) {
          const gradient = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
          gradient.addColorStop(0, hexToRgba(colors[dsIndex % colors.length], 0.3));
          gradient.addColorStop(1, hexToRgba(colors[dsIndex % colors.length], 0));
          ctx.fillStyle = gradient;
          ctx.lineTo(width - padding.right, height - padding.bottom);
          ctx.lineTo(padding.left, height - padding.bottom);
          ctx.closePath();
          ctx.fill();
        }

        // Draw points
        ctx.fillStyle = color;
        dataset.data.forEach((value, index) => {
          const x = padding.left + index * (width - padding.left - padding.right) / (labels.length - 1);
          const y = padding.top + (height - padding.top - padding.bottom) * (1 - (value / maxValue)) * progress;
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 2;
          ctx.stroke();
        });
      });

      // X axis labels
      ctx.fillStyle = '#94A3B8';
      ctx.font = '11px "Plus Jakarta Sans"';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      labels.forEach((label, index) => {
        const x = padding.left + index * (width - padding.left - padding.right) / (labels.length - 1);
        ctx.fillText(label, x, height - padding.bottom + 10);
      });
    };

    animate();
    return () => cancelAnimationFrame(animationRef.current);
  }, [data, options, width, height, colors, fill, tension]);

  function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  }

  function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  return (
    <div className={className} style={{ position: 'relative', width, height }}>
      <canvas ref={canvasRef} width={width} height={height} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}

export function DoughnutChart({
  data,
  options = {},
  width = 300,
  height = 300,
  colors = defaultColors,
  className = '',
  cutout = 0.6,
  showLegend = true,
}) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const labels = data.labels || [];
    const values = data.datasets?.[0]?.data || data.values || [];

    let progress = 0;
    const animate = () => {
      progress = Math.min(progress + 0.02, 1);
      drawChart(ctx, progress);
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    const drawChart = (ctx, progress) => {
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const outerRadius = Math.min(width, height) / 2 - 20;
      const innerRadius = outerRadius * cutout;

      const total = data.reduce((a, b) => a + b, 0);
      let currentAngle = -Math.PI / 2;

      data.forEach((value, index) => {
        const sliceAngle = (value / total) * Math.PI * 2 * progress;
        const color = colors[index % colors.length];

        ctx.beginPath();
        ctx.moveTo(width / 2, height / 2);
        ctx.arc(width / 2, height / 2, outerRadius, currentAngle, currentAngle + sliceAngle);
        ctx.lineTo(width / 2 + Math.cos(currentAngle + sliceAngle) * innerRadius, height / 2 + Math.sin(currentAngle + sliceAngle) * innerRadius);
        ctx.arc(width / 2, height / 2, innerRadius, currentAngle + sliceAngle, currentAngle, true);
        ctx.closePath();
        ctx.fillStyle = colors[index % colors.length];
        ctx.fill();

        currentAngle += sliceAngle;
      });
    };

    animate();
    return () => cancelAnimationFrame(animationRef.current);
  }, [data, width, height, colors, cutout]);

  return (
    <div className={`flex flex-col items-center ${className}`} style={{ width, height }}>
      <div style={{ position: 'relative', width, height }}>
        <canvas ref={canvasRef} width={width} height={height} style={{ width: '100%', height: '100%' }} />
      </div>
      {showLegend && data.labels && (
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          {data.labels.map((label, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <span className="w-3 h-3 rounded" style={{ backgroundColor: colors[index % colors.length] }} />
              <span className="text-neutral-600">{label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default { BarChart, LineChart, DoughnutChart };
