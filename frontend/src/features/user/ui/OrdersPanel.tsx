import React, { useState } from 'react';
import { useMyOrders, useOrderDetail } from '../api/useUserDashboard';
import type { Order } from '../api/useUserDashboard';

export const OrdersPanel: React.FC = () => {
    const [page, setPage] = useState(1);
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const { data, isLoading } = useMyOrders(page);
    const { data: orderDetail, isLoading: detailLoading } = useOrderDetail(selectedOrderId);

    const orders: Order[] = data?.data ?? [];
    const totalPages = data?.totalPages ?? 0;

    if (isLoading) {
        return (
            <div className="space-y-6">
                <p className="text-sm text-lumex-muted mb-6 border-b border-lumex-border pb-4">
                    View your past purchases, article access orders, and download receipts.
                </p>
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lumex-blue" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <p className="text-sm text-lumex-muted mb-6 border-b border-lumex-border pb-4">
                View your past purchases, article access orders, and download receipts.
            </p>

            {/* Order Detail Panel */}
            {selectedOrderId && (
                <div className="bg-lumex-bg-deep border border-lumex-border rounded-lg p-5 mb-4">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-bold text-lumex-text">Order Detail</h3>
                        <button onClick={() => setSelectedOrderId(null)} className="text-xs text-lumex-muted hover:text-lumex-text">&times; Close</button>
                    </div>
                    {detailLoading ? (
                        <div className="flex justify-center py-4"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-lumex-blue" /></div>
                    ) : orderDetail ? (
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div><span className="text-lumex-muted">Order ID:</span> <span className="font-medium text-lumex-text">{orderDetail.orderId}</span></div>
                            <div><span className="text-lumex-muted">Status:</span> <span className="font-medium text-lumex-text">{orderDetail.status}</span></div>
                            <div><span className="text-lumex-muted">Item:</span> <span className="font-medium text-lumex-text">{orderDetail.itemType}: {orderDetail.itemRef}</span></div>
                            <div><span className="text-lumex-muted">Amount:</span> <span className="font-medium text-lumex-text">{orderDetail.currency === 'USD' ? '$' : orderDetail.currency}{orderDetail.amount.toFixed(2)}</span></div>
                            <div><span className="text-lumex-muted">Date:</span> <span className="font-medium text-lumex-text">{new Date(orderDetail.createdAt).toLocaleString()}</span></div>
                            {orderDetail.receiptUrl && (
                                <div><a href={orderDetail.receiptUrl} target="_blank" rel="noopener noreferrer" className="text-lumex-blue hover:underline font-medium">Download Receipt</a></div>
                            )}
                        </div>
                    ) : (
                        <p className="text-sm text-lumex-muted">Could not load order details.</p>
                    )}
                </div>
            )}

            {orders.length === 0 ? (
                <div className="text-center py-16 text-lumex-sub">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 opacity-40"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>
                    <p className="font-medium">No order history</p>
                    <p className="text-sm mt-1">You haven't made any purchases yet.</p>
                </div>
            ) : (
                <>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead>
                                <tr className="border-b-2 border-lumex-border text-lumex-muted">
                                    <th className="pb-3 font-bold pr-6">Order ID</th>
                                    <th className="pb-3 font-bold pr-6">Date</th>
                                    <th className="pb-3 font-bold pr-6">Item</th>
                                    <th className="pb-3 font-bold pr-6 text-right">Amount</th>
                                    <th className="pb-3 font-bold text-center">Status</th>
                                    <th className="pb-3 font-bold text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-lumex-border">
                                {orders.map((order) => (
                                    <tr key={order.id} className="text-lumex-text-secondary hover:bg-lumex-bg-deep transition-colors">
                                        <td className="py-4 pr-6 font-medium text-lumex-text">
                                            <button onClick={() => setSelectedOrderId(order.id)} className="text-lumex-blue hover:underline">{order.id.slice(0, 13)}</button>
                                        </td>
                                        <td className="py-4 pr-6">{new Date(order.createdAt).toLocaleDateString()}</td>
                                        <td className="py-4 pr-6 max-w-[200px] truncate" title={order.itemRef}>
                                            {order.itemType}: {order.itemRef}
                                        </td>
                                        <td className="py-4 pr-6 text-right">
                                            {order.currency === 'USD' ? '$' : order.currency}{order.amount.toFixed(2)}
                                        </td>
                                        <td className="py-4 text-center">
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                                                order.status === 'COMPLETED' || order.status === 'completed'
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                    : order.status === 'PENDING' || order.status === 'pending'
                                                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                                            }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="py-4 text-right">
                                            {order.receiptUrl ? (
                                                <a href={order.receiptUrl} target="_blank" rel="noopener noreferrer" className="text-lumex-blue hover:underline font-medium">
                                                    Receipt
                                                </a>
                                            ) : (
                                                <span className="text-lumex-sub text-xs">—</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 pt-4">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-3 py-1 text-sm border border-lumex-border rounded hover:bg-lumex-bg-deep disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <span className="text-sm text-lumex-muted">
                                Page {page} of {totalPages}
                            </span>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="px-3 py-1 text-sm border border-lumex-border rounded hover:bg-lumex-bg-deep disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};
