
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
  Search
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
      <aside className="w-full md:w-64 bg-slate-900 text-white p-6 md:sticky md:top-0 md:h-screen flex flex-col">
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-indigo-500 p-2 rounded-lg">
            <LayoutDashboard className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">PrincipalAI</h1>
        </div>

        <nav className="flex-1 space-y-4">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 transition-all">
            <TrendingUp className="w-5 h-5" />
            <span className="font-medium">Performance</span>
          </button>
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-800">
          <div className="bg-slate-800 p-4 rounded-xl">
            <p className="text-xs text-slate-400 uppercase font-bold tracking-widest mb-1">Total Portfolio</p>
            <p className="text-lg font-bold text-emerald-400">${totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 lg:p-12 space-y-12 overflow-y-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Sales Target Strategy</h2>
            <p className="text-slate-500 mt-1 font-medium">Analyzing margin, terms, and entry barriers across principals.</p>
          </div>

          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search principals..." 
              className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl w-full md:w-64 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        {/* Chart Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              Quadrant Mapping Analysis
            </h3>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-white border border-slate-100 px-3 py-1 rounded-full shadow-sm">
              Current Fiscal Year
            </div>
          </div>
          <BubbleChart data={filteredData} />
        </section>

        {/* Table Section */}
        <section className="space-y-6">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-indigo-600" />
            Detailed Breakdown
          </h3>
          <DataTable data={filteredData} />
        </section>

        <footer className="pt-8 pb-4 text-center text-slate-400 text-sm font-medium border-t border-slate-200">
          Principal Strategy Dashboard &copy; {new Date().getFullYear()} &bull; Professional Edition
        </footer>
      </main>
    </div>
  );
};

export default App;
