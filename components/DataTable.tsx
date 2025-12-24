
import React, { useState } from 'react';
import { PrincipalData } from '../types';
import { BARRIER_COLORS } from '../constants';

interface DataTableProps {
  data: PrincipalData[];
}

const DataTable: React.FC<DataTableProps> = ({ data }) => {
  const [sortKey, setSortKey] = useState<keyof PrincipalData>('revenue');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const sortedData = [...data].sort((a, b) => {
    const valA = a[sortKey];
    const valB = b[sortKey];
    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const toggleSort = (key: keyof PrincipalData) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="p-4 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => toggleSort('name')}>Principal</th>
              <th className="p-4 cursor-pointer hover:bg-gray-100 transition-colors text-right" onClick={() => toggleSort('margin')}>Margin %</th>
              <th className="p-4 cursor-pointer hover:bg-gray-100 transition-colors text-right" onClick={() => toggleSort('creditTermsNumeric')}>Credit Terms</th>
              <th className="p-4 cursor-pointer hover:bg-gray-100 transition-colors text-right" onClick={() => toggleSort('revenue')}>Revenue</th>
              <th className="p-4 cursor-pointer hover:bg-gray-100 transition-colors text-center" onClick={() => toggleSort('barrierToEntry')}>Barrier</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((p) => (
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
