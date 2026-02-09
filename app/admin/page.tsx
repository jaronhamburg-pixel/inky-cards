import { getAllOrders } from '@/lib/data/mock-orders';
import { mockCards } from '@/lib/data/mock-cards';
import { formatPrice } from '@/lib/utils/formatting';
import { Badge } from '@/components/ui/badge';

export default function AdminDashboardPage() {
  const orders = getAllOrders();
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = orders.filter((order) => order.status === 'pending').length;
  const thisWeekOrders = orders.filter((order) => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return order.createdAt >= oneWeekAgo;
  }).length;

  const statusColors: Record<string, 'default' | 'warning' | 'success' | 'info'> = {
    pending: 'warning',
    processing: 'info',
    printing: 'info',
    shipped: 'success',
    delivered: 'success',
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="heading-display text-luxury-charcoal mb-2">Dashboard</h1>
        <p className="text-neutral-600">Welcome to the Inky Cards admin panel</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-neutral-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-600">Total Orders</span>
            <span className="text-2xl">📦</span>
          </div>
          <p className="text-3xl font-bold text-luxury-charcoal">{orders.length}</p>
          <p className="text-xs text-neutral-500 mt-1">All time</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-neutral-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-600">Total Revenue</span>
            <span className="text-2xl">💰</span>
          </div>
          <p className="text-3xl font-bold text-luxury-gold">{formatPrice(totalRevenue)}</p>
          <p className="text-xs text-neutral-500 mt-1">All time</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-neutral-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-600">This Week</span>
            <span className="text-2xl">📅</span>
          </div>
          <p className="text-3xl font-bold text-luxury-charcoal">{thisWeekOrders}</p>
          <p className="text-xs text-neutral-500 mt-1">Last 7 days</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-neutral-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-600">Pending</span>
            <span className="text-2xl">⏳</span>
          </div>
          <p className="text-3xl font-bold text-luxury-charcoal">{pendingOrders}</p>
          <p className="text-xs text-neutral-500 mt-1">Needs attention</p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg border border-neutral-200 p-6">
        <h2 className="font-semibold text-lg text-luxury-charcoal mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">
                  Order
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">
                  Customer
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">
                  Date
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">
                  Total
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 10).map((order) => (
                <tr key={order.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                  <td className="py-3 px-4 text-sm">
                    <a
                      href={`/admin/orders/${order.id}`}
                      className="text-luxury-gold hover:underline"
                    >
                      {order.orderNumber}
                    </a>
                  </td>
                  <td className="py-3 px-4 text-sm text-neutral-700">
                    {order.customer.firstName} {order.customer.lastName}
                  </td>
                  <td className="py-3 px-4 text-sm text-neutral-600">
                    {order.createdAt.toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-sm font-semibold text-luxury-gold">
                    {formatPrice(order.total)}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <Badge variant={statusColors[order.status]} className="capitalize">
                      {order.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Popular Cards */}
      <div className="bg-white rounded-lg border border-neutral-200 p-6">
        <h2 className="font-semibold text-lg text-luxury-charcoal mb-4">Card Inventory</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
            <div className="text-2xl">🎴</div>
            <div>
              <p className="font-semibold text-luxury-charcoal">{mockCards.length}</p>
              <p className="text-sm text-neutral-600">Total Cards</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
            <div className="text-2xl">⭐</div>
            <div>
              <p className="font-semibold text-luxury-charcoal">
                {mockCards.filter((c) => c.category === 'luxury').length}
              </p>
              <p className="text-sm text-neutral-600">Luxury Cards</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
