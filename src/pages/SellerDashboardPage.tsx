import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { sellerService } from '@/services';
import { useAuth } from '@/contexts/AuthContext';
import { products } from '@/data/mockData';
import Badge from '@/components/Badge';
import LoadingSpinner from '@/components/LoadingSpinner';
import type { Sale } from '@/types';

export default function SellerDashboardPage() {
  const { isAuthenticated, login } = useAuth();
  const [stats, setStats] = useState<{ totalRevenue: number; totalSales: number; activeProducts: number; avgRating: number } | null>(null);
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    login();
    setLoading(true);
    Promise.all([
      sellerService.getDashboardStats(),
      sellerService.getSales(),
    ]).then(([s, sa]) => { setStats(s); setSales(sa); setLoading(false); });
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-surface-700">Sign in to access the seller dashboard.</p>
          <Link to="/login" className="mt-4 inline-block btn-primary">Sign In</Link>
        </div>
      </div>
    );
  }

  if (loading) return <LoadingSpinner message="Loading dashboard..." />;

  const monthlyData = [
    { month: 'Apr', revenue: 1200, orders: 30 },
    { month: 'May', revenue: 1800, orders: 45 },
    { month: 'Jun', revenue: 2100, orders: 52 },
    { month: 'Jul', revenue: 1950, orders: 48 },
    { month: 'Aug', revenue: 2400, orders: 60 },
    { month: 'Sep', revenue: 1480, orders: 38 },
  ];
  const maxRevenue = Math.max(...monthlyData.map(d => d.revenue));

  return (
    <div className="container-narrow py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-surface-900">Seller Dashboard</h1>
        <Link to="/seller/products/new" className="btn-primary">+ Add Product</Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: 'Total Revenue', value: `$${stats?.totalRevenue.toLocaleString()}`, color: 'text-green-600' },
          { label: 'Total Sales', value: stats?.totalSales.toLocaleString() ?? '0', color: 'text-surface-900' },
          { label: 'Active Products', value: stats?.activeProducts ?? '0', color: 'text-surface-900' },
          { label: 'Avg Rating', value: stats?.avgRating?.toFixed(1) ?? '0.0', color: 'text-amber-500' },
        ].map(s => (
          <div key={s.label} className="card">
            <p className="text-sm text-surface-500">{s.label}</p>
            <p className={`mt-1 text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="mt-8 rounded-xl border border-surface-200 p-6">
        <h2 className="mb-6 text-lg font-semibold text-surface-900">Revenue (Last 6 Months)</h2>
        <div className="flex items-end gap-3 h-48">
          {monthlyData.map(d => (
            <div key={d.month} className="flex flex-1 flex-col items-center gap-1">
              <span className="text-xs text-surface-500">${(d.revenue / 1000).toFixed(1)}k</span>
              <div className="w-full rounded-t-lg bg-primary-600 transition-all hover:bg-primary-700" style={{ height: `${(d.revenue / maxRevenue) * 100}%`, minHeight: '8px' }} />
              <span className="text-xs text-surface-600">{d.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* My Products */}
      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold text-surface-900">My Products</h2>
        <div className="rounded-xl border border-surface-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-surface-600">Product</th>
                <th className="px-4 py-3 text-left font-medium text-surface-600">Status</th>
                <th className="px-4 py-3 text-left font-medium text-surface-600">Price</th>
                <th className="px-4 py-3 text-left font-medium text-surface-600">Sales</th>
                <th className="px-4 py-3 text-left font-medium text-surface-600">Revenue</th>
                <th className="px-4 py-3 text-left font-medium text-surface-600">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-200">
              {products.filter(p => p.developerId === 'd1' || p.id.startsWith('draft-')).slice(0, 7).map(p => {
                const revenue = p.salesCount * p.price;
                return (
                  <tr key={p.id}>
                    <td className="px-4 py-3 font-medium text-surface-900">{p.icon} {p.name}</td>
                    <td className="px-4 py-3"><Badge variant={p.status === 'Published' ? 'success' : p.status === 'Draft' ? 'warning' : 'error'}>{p.status}</Badge></td>
                    <td className="px-4 py-3">${p.price}</td>
                    <td className="px-4 py-3">{p.salesCount.toLocaleString()}</td>
                    <td className="px-4 py-3">${revenue.toLocaleString()}</td>
                    <td className="px-4 py-3">{p.rating.toFixed(1)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Sales */}
      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold text-surface-900">Recent Sales</h2>
        <div className="rounded-xl border border-surface-200 overflow-x-auto">
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
              {sales.slice(0, 5).map(s => (
                <tr key={s.id}>
                  <td className="px-4 py-3 text-surface-500">{s.date}</td>
                  <td className="px-4 py-3 font-medium text-surface-900">{s.productName}</td>
                  <td className="px-4 py-3 text-surface-500">{s.buyerName}</td>
                  <td className="px-4 py-3">${s.amount.toFixed(2)}</td>
                  <td className="px-4 py-3"><Badge variant={s.status === 'Completed' ? 'success' : s.status === 'Refunded' ? 'error' : 'warning'}>{s.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
