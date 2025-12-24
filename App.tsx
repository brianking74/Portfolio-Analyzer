
import React, { useState, useEffect } from 'react';
import { parsePrincipalCSV } from './services/dataParser';
import { PrincipalData } from './types';
import { CSV_DATA } from './constants';
import BubbleChart from './components/BubbleChart';
import DataTable from './components/DataTable';
import { 
  TrendingUp, 
  BarChart3, 
  LayoutDashboard, 
  Search,
  Sparkles
} from 'lucide-react';

const App: React.FC = () => {
  const [data, setData] = useState<PrincipalData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const parsed = parsePrincipalCSV(CSV_DATA);
    setData(parsed);
  }, []);

  const filteredData = data.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRevenue = data.reduce((sum, p) => sum + p.revenue, 0);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-80 bg-slate-900 text-white p-6 md:sticky md:top-0 md:h-screen flex flex-col overflow-y-auto">
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-indigo-500 p-2 rounded-lg">
            <LayoutDashboard className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">PrincipalAI</h1>
        </div>

        <nav className="space-y-4 mb-10">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 transition-all">
            <TrendingUp className="w-5 h-5" />
            <span className="font-medium">Performance Matrix</span>
          </button>
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-800">
          <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-xl">
            <p className="text-xs text-indigo-300 uppercase font-bold tracking-widest mb-1">Total Portfolio Revenue</p>
            <p className="text-2xl font-black text-white">${totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 lg:p-10 space-y-10 overflow-y-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm uppercase tracking-widest mb-1">
              <Sparkles className="w-4 h-4" />
              Strategy Intelligence
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Sales Target Matrix</h2>
            <p className="text-slate-500 mt-2 font-medium max-w-xl">
              Bubble quadrant analysis visualizing the optimal trade-off between profit margins and favorable credit terms.
            </p>
          </div>

          <div className="relative group self-start">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Filter principals..." 
              className="pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl w-full md:w-72 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        {/* Chart Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-indigo-600" />
              Quadrant Mapping
            </h3>
            <div className="flex gap-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">
                X: CREDIT TERMS
              </span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">
                Y: PROFIT MARGIN
              </span>
            </div>
          </div>
          <BubbleChart data={filteredData} />
        </section>

        {/* Table Section */}
        <section className="space-y-6">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6 text-indigo-600" />
            Principal Data Ledger
          </h3>
          <DataTable data={filteredData} />
        </section>

        <footer className="pt-10 pb-6 text-center text-slate-400 text-xs font-bold uppercase tracking-widest border-t border-slate-200">
          Principal Performance Intelligence &copy; {new Date().getFullYear()} &bull; Professional Edition
        </footer>
      </main>
    </div>
  );
};

export default App;
