
import React, { useState, useMemo } from 'react';
import { PrincipalData, BarrierLevel } from '../types';
import { BARRIER_COLORS } from '../constants';
import { Filter, X } from 'lucide-react';

interface DataTableProps {
  data: PrincipalData[];
}

interface FilterState {
  name: string;
  margin: string;
  creditTerms: string;
  revenue: string;
  barrier: string;
}

const DataTable: React.FC<DataTableProps> = ({ data }) => {
  const [sortKey, setSortKey] = useState<keyof PrincipalData>('revenue');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    name: '',
    margin: '',
    creditTerms: '',
    revenue: '',
    barrier: '',
  });

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      name: '',
      margin: '',
      creditTerms: '',
      revenue: '',
      barrier: '',
    });
  };

  const filteredAndSortedData = useMemo(() => {
    return [...data]
      .filter(p => {
        const nameMatch = p.name.toLowerCase().includes(filters.name.toLowerCase());
        const marginMatch = filters.margin === '' || p.margin >= parseFloat(filters.margin);
        const termsMatch = p.creditTerms.toLowerCase().includes(filters.creditTerms.toLowerCase());
        const revenueMatch = filters.revenue === '' || p.revenue >= parseFloat(filters.revenue);
        const barrierMatch = filters.barrier === '' || p.barrierToEntry.toString() === filters.barrier;
        
        return nameMatch && marginMatch && termsMatch && revenueMatch && barrierMatch;
      })
      .sort((a, b) => {
        const valA = a[sortKey];
        const valB = b[sortKey];
        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [data, filters, sortKey, sortOrder]);

  const toggleSort = (key: keyof PrincipalData) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${showFilters ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            <Filter className="w-4 h-4" />
            {showFilters ? 'Hide Filters' : 'Filter Ledger'}
          </button>
          {Object.values(filters).some(v => v !== '') && (
            <button 
              onClick={clearFilters}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-bold bg-rose-50 text-rose-600 hover:bg-rose-100 transition-all"
            >
              <X className="w-4 h-4" />
              Reset
            </button>
          )}
        </div>
        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          {filteredAndSortedData.length} of {data.length} Results
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="p-4 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => toggleSort('name')}>
                <div className="flex items-center gap-1">
                  Principal {sortKey === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                </div>
              </th>
              <th className="p-4 cursor-pointer hover:bg-gray-100 transition-colors text-right" onClick={() => toggleSort('margin')}>
                <div className="flex items-center justify-end gap-1">
                  Margin % {sortKey === 'margin' && (sortOrder === 'asc' ? '↑' : '↓')}
                </div>
              </th>
              <th className="p-4 cursor-pointer hover:bg-gray-100 transition-colors text-right" onClick={() => toggleSort('creditTermsNumeric')}>
                <div className="flex items-center justify-end gap-1">
                  Terms {sortKey === 'creditTermsNumeric' && (sortOrder === 'asc' ? '↑' : '↓')}
                </div>
              </th>
              <th className="p-4 cursor-pointer hover:bg-gray-100 transition-colors text-right" onClick={() => toggleSort('revenue')}>
                <div className="flex items-center justify-end gap-1">
                  Revenue {sortKey === 'revenue' && (sortOrder === 'asc' ? '↑' : '↓')}
                </div>
              </th>
              <th className="p-4 cursor-pointer hover:bg-gray-100 transition-colors text-center" onClick={() => toggleSort('barrierToEntry')}>
                <div className="flex items-center justify-center gap-1">
                  Barrier {sortKey === 'barrierToEntry' && (sortOrder === 'asc' ? '↑' : '↓')}
                </div>
              </th>
            </tr>
            
            {showFilters && (
              <tr className="bg-slate-50 border-b border-slate-100 animate-in slide-in-from-top-2 duration-200">
                <td className="p-2">
                  <input 
                    type="text" 
                    placeholder="Filter name..."
                    className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded focus:ring-1 focus:ring-indigo-500 outline-none"
                    value={filters.name}
                    onChange={(e) => handleFilterChange('name', e.target.value)}
                  />
                </td>
                <td className="p-2">
                  <input 
                    type="number" 
                    placeholder="Min %"
                    className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded focus:ring-1 focus:ring-indigo-500 outline-none text-right"
                    value={filters.margin}
                    onChange={(e) => handleFilterChange('margin', e.target.value)}
                  />
                </td>
                <td className="p-2">
                  <input 
                    type="text" 
                    placeholder="Search terms..."
                    className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded focus:ring-1 focus:ring-indigo-500 outline-none text-right"
                    value={filters.creditTerms}
                    onChange={(e) => handleFilterChange('creditTerms', e.target.value)}
                  />
                </td>
                <td className="p-2">
                  <input 
                    type="number" 
                    placeholder="Min Rev"
                    className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded focus:ring-1 focus:ring-indigo-500 outline-none text-right"
                    value={filters.revenue}
                    onChange={(e) => handleFilterChange('revenue', e.target.value)}
                  />
                </td>
                <td className="p-2">
                  <select 
                    className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded focus:ring-1 focus:ring-indigo-500 outline-none"
                    value={filters.barrier}
                    onChange={(e) => handleFilterChange('barrier', e.target.value)}
                  >
                    <option value="">All</option>
                    <option value="1">Level 1</option>
                    <option value="2">Level 2</option>
                    <option value="3">Level 3</option>
                  </select>
                </td>
              </tr>
            )}
          </thead>
          <tbody>
            {filteredAndSortedData.length > 0 ? (
              filteredAndSortedData.map((p) => (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-indigo-50/30 transition-colors">
                  <td className="p-4 font-semibold text-gray-700">{p.name}</td>
                  <td className="p-4 text-right text-indigo-600 font-medium">{p.margin}%</td>
                  <td className="p-4 text-right text-gray-600">{p.creditTerms}</td>
                  <td className="p-4 text-right text-emerald-600 font-bold">${p.revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td className="p-4 text-center">
                    <span 
                      className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm"
                      style={{ backgroundColor: BARRIER_COLORS[p.barrierToEntry] }}
                    >
                      Level {p.barrierToEntry}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-10 text-center text-slate-400 font-medium">
                  No principals match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
