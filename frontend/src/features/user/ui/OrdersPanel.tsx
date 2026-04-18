import React from 'react';

export const OrdersPanel: React.FC = () => {
    const orders = [
        {
            id: 'ORD-5928-1123',
            date: '2024-03-01',
            total: 39.95,
            items: [
                { title: 'Article Access: Advanced Machine Learning Techniques in Modern Healthcare', type: 'PDF + HTML 48h access' }
            ],
            status: 'Completed'
        },
        {
            id: 'ORD-1029-4822',
            date: '2023-11-15',
            total: 59.95,
            items: [
                { title: 'Article Access: Review of Quantum Algorithms', type: 'PDF + HTML Perpetual access' }
            ],
            status: 'Completed'
        }
    ];

    return (
        <div className="space-y-6">
            <p className="text-sm text-gray-600 mb-6 border-b border-lumex-border pb-4">
                View your past purchases, article access orders, and download receipts.
            </p>

            {orders.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 opacity-40"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>
                    <p className="font-medium">No order history</p>
                    <p className="text-sm mt-1">You haven't made any purchases yet.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead>
                            <tr className="border-b-2 border-lumex-border text-gray-700">
                                <th className="pb-3 font-bold pr-6">Order ID</th>
                                <th className="pb-3 font-bold pr-6">Date</th>
                                <th className="pb-3 font-bold pr-6">Items</th>
                                <th className="pb-3 font-bold pr-6 text-right">Total</th>
                                <th className="pb-3 font-bold text-center">Status</th>
                                <th className="pb-3 font-bold text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-lumex-border">
                            {orders.map((order) => (
                                <tr key={order.id} className="text-gray-600 hover:bg-gray-50 transition-colors">
                                    <td className="py-4 pr-6 font-medium text-lumex-text">{order.id}</td>
                                    <td className="py-4 pr-6">{new Date(order.date).toLocaleDateString()}</td>
                                    <td className="py-4 pr-6 max-w-[200px] truncate" title={order.items[0].title}>
                                        {order.items[0].title}
                                        {order.items.length > 1 && ` + ${order.items.length - 1} more`}
                                    </td>
                                    <td className="py-4 pr-6 text-right">${order.total.toFixed(2)}</td>
                                    <td className="py-4 text-center">
                                        <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-0.5 rounded">
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="py-4 text-right">
                                        <button className="text-lumex-blue hover:underline font-medium">Receipt</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};
