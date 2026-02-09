'use client';

import { useState } from 'react';
import { getAllOrders, updateOrderStatus } from '@/lib/data/mock-orders';
import { formatPrice, formatOrderNumber } from '@/lib/utils/formatting';
import { Badge } from '@/components/ui/badge';
import type { OrderStatus } from '@/types/order';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState(getAllOrders());
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all');

  const filteredOrders = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    const updated = updateOrderStatus(orderId, newStatus);
    if (updated) {
      setOrders(getAllOrders());
    }
  };

  const statusColors: Record<OrderStatus, 'default' | 'warning' | 'success' | 'info'> = {
    pending: 'warning',
    processing: 'info',
    printing: 'info',
    shipped: 'success',
    delivered: 'success',
  };

  const statusOptions: OrderStatus[] = ['pending', 'processing', 'printing', 'shipped', 'delivered'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="heading-display text-luxury-charcoal mb-2">Orders</h1>
          <p className="text-neutral-600">Manage and track all orders</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'all'
              ? 'bg-luxury-gold text-luxury-charcoal'
              : 'bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-300'
          }`}
        >
          All ({orders.length})
        </button>
        {statusOptions.map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
              filter === status
                ? 'bg-luxury-gold text-luxury-charcoal'
                : 'bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-300'
            }`}
          >
            {status} ({orders.filter((o) => o.status === status).length})
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg border border-neutral-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="text-left py-4 px-6 text-sm font-semibold text-neutral-700">
                  Order
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-neutral-700">
                  Customer
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-neutral-700">
                  Date
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-neutral-700">
                  Items
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-neutral-700">
                  Total
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-neutral-700">
                  Status
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-neutral-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                  <td className="py-4 px-6 text-sm">
                    <a href={`/orders/${order.id}`} className="text-luxury-gold hover:underline font-medium">
                      {formatOrderNumber(order.orderNumber)}
                    </a>
                  </td>
                  <td className="py-4 px-6 text-sm">
                    <div>
                      <p className="font-medium text-neutral-700">
                        {order.customer.firstName} {order.customer.lastName}
                      </p>
                      <p className="text-xs text-neutral-500">{order.customer.email}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-neutral-600">
                    {order.createdAt.toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6 text-sm text-neutral-600">
                    {order.items.reduce((sum, item) => sum + item.quantity, 0)} cards
                  </td>
                  <td className="py-4 px-6 text-sm font-semibold text-luxury-gold">
                    {formatPrice(order.total)}
                  </td>
                  <td className="py-4 px-6 text-sm">
                    <Badge variant={statusColors[order.status]} className="capitalize">
                      {order.status}
                    </Badge>
                  </td>
                  <td className="py-4 px-6 text-sm">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                      className="text-xs px-2 py-1 border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-luxury-gold"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status} className="capitalize">
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="py-12 text-center text-neutral-500">
            <p>No orders found with this filter</p>
          </div>
        )}
      </div>
    </div>
  );
}
