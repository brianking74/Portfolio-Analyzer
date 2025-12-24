
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
      <div className="bg-white p-4 shadow-xl border border-gray-100 rounded-lg z-50">
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
    
    // Custom mapping for outliers to keep the requested order: 0 -> 120 -> outliers -> COD -> PIA
    if (xVal > 120 && xVal < 170) {
      // e.g. 160 days credit is mapped to 145 to sit between 120 and COD (170)
      xVal = 145;
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
  const avgTerms = 90; // Typical 90-day split

  return (
    <div className="w-full h-[600px] bg-white rounded-xl shadow-sm border border-gray-100 p-6 relative">
      <div className="absolute top-8 left-1/2 -translate-x-1/2 flex gap-8 pointer-events-none opacity-20 font-bold uppercase tracking-widest text-sm z-0">
        <div className="text-red-600">Short/Immediate Terms (Risk)</div>
        <div className="text-green-600">Generous Terms (Partner)</div>
      </div>
      
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 20, right: 30, bottom: 50, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f2f2f2" vertical={false} />
          <XAxis 
            type="number" 
            dataKey="x" 
            name="Credit Terms" 
            domain={[0, 210]}
            ticks={[0, 30, 60, 90, 120, 170, 200]}
            tick={{ fontSize: 11, fontWeight: 600, fill: '#64748b' }}
            tickFormatter={(val) => {
              if (val === 170) return 'COD';
              if (val === 200) return 'PIA';
              if (val === 0) return '0';
              return `${val}d`;
            }}
          >
            <Label value="Credit Terms (Lowest Days Left → PIA/COD Right)" offset={-40} position="insideBottom" fill="#475569" style={{ fontSize: '13px', fontWeight: 600 }} />
          </XAxis>
          <YAxis 
            type="number" 
            dataKey="y" 
            name="Margin" 
            unit="%" 
            domain={[0, 105]}
            tick={{ fontSize: 11, fontWeight: 600, fill: '#64748b' }}
          >
             <Label value="Profit Margin %" angle={-90} position="insideLeft" style={{ textAnchor: 'middle', fontSize: '13px', fontWeight: 600 }} fill="#475569" />
          </YAxis>
          <ZAxis type="number" dataKey="z" range={[80, 2500]} />
          
          {/* Quadrant Lines */}
          <ReferenceLine y={avgMargin} stroke="#cbd5e1" strokeWidth={2} strokeDasharray="8 4" />
          <ReferenceLine x={avgTerms} stroke="#cbd5e1" strokeWidth={2} strokeDasharray="8 4" />
          
          <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3', stroke: '#cbd5e1' }} />
          
          <Scatter data={chartData}>
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.fill} 
                fillOpacity={0.75} 
                stroke={entry.fill} 
                strokeWidth={2}
                className="transition-all duration-300 hover:fill-opacity-100"
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
      
      {/* Visual Legend */}
      <div className="mt-6 flex flex-wrap justify-center items-center gap-8 border-t border-gray-50 pt-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#22c55e]"></div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Level 1: Low Barrier</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#eab308]"></div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Level 2: Moderate</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#ef4444]"></div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Level 3: High Barrier</span>
        </div>
        <div className="h-4 w-px bg-slate-200 mx-2 hidden md:block"></div>
        <div className="flex items-center gap-3">
           <div className="flex items-end gap-1">
             <div className="w-2 h-2 rounded-full bg-slate-300"></div>
             <div className="w-4 h-4 rounded-full bg-slate-300"></div>
             <div className="w-6 h-6 rounded-full bg-slate-300"></div>
           </div>
           <span className="text-xs font-bold text-slate-400 uppercase tracking-wider italic">Bubble Size = Revenue</span>
        </div>
      </div>
    </div>
  );
};

export default BubbleChart;
