
import React from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
  Label,
  CartesianGrid
} from 'recharts';
import { PrincipalData, ChartDataPoint } from '../types';
import { BARRIER_COLORS } from '../constants';

interface BubbleChartProps {
  data: PrincipalData[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload as ChartDataPoint;
    return (
      <div className="bg-white p-4 shadow-xl border border-gray-100 rounded-lg z-50 pointer-events-none">
        <p className="font-bold text-gray-800 text-lg mb-1">{item.name}</p>
        <div className="space-y-1 text-sm">
          <p><span className="text-gray-500">Margin:</span> <span className="font-medium text-indigo-600">{item.y}%</span></p>
          <p><span className="text-gray-500">Credit Terms:</span> <span className="font-medium text-orange-600">{item.originalTerms}</span></p>
          <p><span className="text-gray-500">Revenue:</span> <span className="font-medium text-emerald-600">${item.revenue.toLocaleString()}</span></p>
          <p><span className="text-gray-500">Barrier Entry:</span> <span className="font-medium px-2 py-0.5 rounded" style={{ backgroundColor: `${item.fill}20`, color: item.fill }}>Level {item.barrier}</span></p>
        </div>
      </div>
    );
  }
  return null;
};

const BubbleChart: React.FC<BubbleChartProps> = ({ data }) => {
  const chartData: ChartDataPoint[] = data.map(p => {
    let xVal = p.creditTermsNumeric;
    
    // If it's a standard day count (not COD/PIA which are mapped to 0, 15), 
    // offset it by 30 to sit after COD on the axis
    if (xVal > 15 || (p.creditTerms.toLowerCase().includes('0') && !p.creditTerms.toLowerCase().includes('c'))) {
       // Offset standard days to start after COD (which is at 15)
       xVal = xVal + 30;
    }

    return {
      x: xVal,
      y: p.margin,
      z: Math.sqrt(p.revenue), 
      name: p.name,
      originalTerms: p.creditTerms,
      barrier: p.barrierToEntry,
      revenue: p.revenue,
      fill: BARRIER_COLORS[p.barrierToEntry] || '#94a3b8'
    };
  });

  // Calculate mid-points for quadrant lines
  const avgMargin = 40; 
  const avgTerms = 75; // Adjusted mid-point for new scale

  return (
    <div className="w-full h-[600px] bg-white rounded-xl shadow-sm border border-gray-100 p-6 relative">
      {/* Dynamic Background Labels */}
      <div className="absolute top-10 left-0 right-0 flex justify-center pointer-events-none z-0 px-10 md:px-20">
        <div className="w-full flex justify-between items-center text-[9px] md:text-[11px] font-black tracking-[0.2em] text-slate-300">
           <div className="flex-1 flex items-center gap-4">
              <div className="h-[1px] flex-1 bg-slate-100"></div>
              <span>GENEROUS TERMS (PARTNER)</span>
           </div>
           <div className="w-12 md:w-16 flex justify-center text-slate-200">|</div>
           <div className="flex-1 flex items-center gap-4">
              <span>SHORT/IMMEDIATE TERMS (RISK)</span>
              <div className="h-[1px] flex-1 bg-slate-100"></div>
           </div>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 40, right: 30, bottom: 50, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f8fafc" vertical={false} />
          <XAxis 
            type="number" 
            dataKey="x" 
            name="Credit Terms" 
            domain={[0, 160]}
            ticks={[0, 15, 30, 60, 90, 120, 150]}
            tick={{ fontSize: 11, fontWeight: 600, fill: '#94a3b8' }}
            tickFormatter={(val) => {
              if (val === 0) return 'PIA';
              if (val === 15) return 'COD';
              if (val === 30) return '0d';
              return `${val - 30}d`; // Un-offset the labels for standard days
            }}
          >
            <Label value="Credit Terms Scale (First: Immediate → Last: Deferred)" offset={-40} position="insideBottom" fill="#94a3b8" style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }} />
          </XAxis>
          <YAxis 
            type="number" 
            dataKey="y" 
            name="Margin" 
            unit="%" 
            domain={[0, 105]}
            tick={{ fontSize: 11, fontWeight: 600, fill: '#94a3b8' }}
          >
             <Label value="Profit Margin %" angle={-90} position="insideLeft" style={{ textAnchor: 'middle', fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }} fill="#94a3b8" />
          </YAxis>
          <ZAxis type="number" dataKey="z" range={[80, 2500]} />
          
          {/* Quadrant Lines */}
          <ReferenceLine y={avgMargin} stroke="#f1f5f9" strokeWidth={2} />
          <ReferenceLine x={avgTerms} stroke="#f1f5f9" strokeWidth={2} />
          
          <Tooltip 
            content={<CustomTooltip />} 
            cursor={{ strokeDasharray: '3 3', stroke: '#e2e8f0' }}
            isAnimationActive={false}
          />
          
          <Scatter data={chartData} isAnimationActive={false}>
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.fill} 
                fillOpacity={0.7} 
                stroke={entry.fill} 
                strokeWidth={2}
                className="transition-opacity duration-200 hover:fill-opacity-100 cursor-pointer"
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
      
      {/* Visual Legend */}
      <div className="mt-6 flex flex-wrap justify-center items-center gap-8 border-t border-gray-50 pt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#22c55e]"></div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Low Barrier</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#eab308]"></div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Moderate</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ef4444]"></div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">High Barrier</span>
        </div>
        <div className="h-4 w-px bg-slate-100 mx-2 hidden md:block"></div>
        <div className="flex items-center gap-3">
           <div className="flex items-end gap-1">
             <div className="w-2 h-2 rounded-full bg-slate-200"></div>
             <div className="w-3 h-3 rounded-full bg-slate-200"></div>
             <div className="w-4 h-4 rounded-full bg-slate-200"></div>
           </div>
           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Size: Revenue</span>
        </div>
      </div>
    </div>
  );
};

export default BubbleChart;
