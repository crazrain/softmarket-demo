import { useState, useEffect } from 'react';
import { sellerService } from '@/services';
import { useAuth } from '@/contexts/AuthContext';
import Badge from '@/components/Badge';
import LoadingSpinner from '@/components/LoadingSpinner';
import type { Sale } from '@/types';

export default function SalesPage() {
  const { isAuthenticated } = useAuth();
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('All');

  useEffect(() => {
    setLoading(true);
    sellerService.getSales().then((data) => { setSales(data); setLoading(false); });
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-surface-700">Sign in to view sales data.</p>
          <button onClick={() => window.location.href = '/login'} className="mt-4 btn-primary">Sign In</button>
        </div>
      </div>
    );
  }

  const filtered = filter === 'All' ? sales : sales.filter(s => s.status === filter);
  const totalRevenue = filtered.filter(s => s.status === 'Completed').reduce((sum, s) => sum + s.amount, 0);

  return (
    <div className="container-narrow py-8">
      <h1 className="text-2xl font-bold text-surface-900">Sales</h1>
      <p className="mt-1 text-sm text-surface-500">Track your sales performance</p>

      {/* Summary */}
      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="card"><p className="text-sm text-surface-500">Total Revenue</p><p className="mt-1 text-xl font-bold text-green-600">${totalRevenue.toLocaleString()}</p></div>
        <div className="card"><p className="text-sm text-surface-500">Orders</p><p className="mt-1 text-xl font-bold text-surface-900">{filtered.filter(s => s.status === 'Completed').length}</p></div>
        <div className="card"><p className="text-sm text-surface-500">Refunds</p><p className="mt-1 text-xl font-bold text-red-600">{filtered.filter(s => s.status === 'Refunded').length}</p></div>
      </div>

      {/* Filters */}
      <div className="mt-6 flex items-center gap-2">
        {['All', 'Completed', 'Refunded'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${filter === f ? 'bg-primary-600 text-white' : 'bg-surface-100 text-surface-600 hover:bg-surface-200'}`}>
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="mt-4 rounded-xl border border-surface-200 overflow-x-auto">
        {loading ? <LoadingSpinner message="Loading..." /> : (
          <table className="w-full text-sm">
            <thead className="bg-surface-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-surface-600">Date</th>
                <th className="px-4 py-3 text-left font-medium text-surface-600">Product</th>
                <th className="px-4 py-3 text-left font-medium text-surface-600">Customer</th>
                <th className="px-4 py-3 text-left font-medium text-surface-600">Amount</th>
                <th className="px-4 py-3 text-left font-medium text-surface-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-200">
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-surface-500">No sales data available.</td></tr>
              ) : filtered.map(s => (
                <tr key={s.id}>
                  <td className="px-4 py-3 text-surface-500">{s.date}</td>
                  <td className="px-4 py-3 font-medium text-surface-900">{s.productName}</td>
                  <td className="px-4 py-3 text-surface-500">{s.buyerName}</td>
                  <td className="px-4 py-3">${s.amount.toFixed(2)}</td>
                  <td className="px-4 py-3"><Badge variant={s.status === 'Completed' ? 'success' : 'error'}>{s.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
