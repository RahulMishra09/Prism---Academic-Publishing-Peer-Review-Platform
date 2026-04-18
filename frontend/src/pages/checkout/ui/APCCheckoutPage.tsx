import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Button } from '@shared/ui';

export const APCCheckoutPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'institution'>('card');
    const [processing, setProcessing] = useState(false);

    const handlePayment = () => {
        setProcessing(true);
        setTimeout(() => {
            alert('Payment processed successfully! Your article is now scheduled for final production steps.');
            void navigate('/account');
        }, 2000);
    };

    const apcAmount = 2750;

    return (
        <Container className="py-12 max-w-4xl">
            <div className="mb-10 text-center">
                <h1 className="text-3xl font-serif font-bold text-lumex-text mb-2">Article Processing Charge (APC)</h1>
                <p className="text-lumex-text-secondary italic">Manuscript ID: {id}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Left: Summary */}
                <div className="space-y-6">
                    <section className="bg-white p-6 border border-lumex-border rounded-xl shadow-sm">
                        <h2 className="text-lg font-bold text-lumex-text mb-6 pb-2 border-b">Publication Summary</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Service</span>
                                <span className="font-bold text-lumex-text">Gold Open Access</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Journal</span>
                                <span className="font-bold text-lumex-text">Lumex Medicine</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Processing Fee</span>
                                <span className="font-bold text-lumex-text">${apcAmount.toLocaleString()}.00</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Taxes (VAT/GST)</span>
                                <span className="font-bold text-lumex-text">$0.00</span>
                            </div>
                            <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                                <span className="text-lg font-bold text-lumex-text">Total Due</span>
                                <span className="text-2xl font-bold text-lumex-blue">${apcAmount.toLocaleString()}.00</span>
                            </div>
                        </div>
                    </section>

                    <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-lg">
                        <p className="text-xs text-yellow-800 leading-relaxed">
                            <span className="font-bold">Note:</span> Many institutions have agreements with Lumex to cover APCs. If you believe your institution covers this fee, please select "Institutional Waiver".
                        </p>
                    </div>
                </div>

                {/* Right: Payment Method */}
                <div className="space-y-6">
                    <section className="bg-white p-6 border border-lumex-border rounded-xl shadow-sm">
                        <h2 className="text-lg font-bold text-lumex-text mb-6 pb-2 border-b">Payment Method</h2>
                        <div className="space-y-3 mb-8">
                            <button
                                onClick={() => setPaymentMethod('card')}
                                className={`w-full flex items-center justify-between p-4 border rounded-lg transition-all ${paymentMethod === 'card' ? 'border-lumex-blue bg-blue-50/30 ring-1 ring-lumex-blue' : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <svg className="text-gray-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>
                                    <span className="text-sm font-bold text-lumex-text">Credit / Debit Card</span>
                                </div>
                                {paymentMethod === 'card' && <div className="w-4 h-4 rounded-full bg-lumex-blue border-4 border-white shadow-sm" />}
                            </button>

                            <button
                                onClick={() => setPaymentMethod('institution')}
                                className={`w-full flex items-center justify-between p-4 border rounded-lg transition-all ${paymentMethod === 'institution' ? 'border-lumex-blue bg-blue-50/30 ring-1 ring-lumex-blue' : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <svg className="text-gray-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>
                                    <span className="text-sm font-bold text-lumex-text">Institutional Waiver / Voucher</span>
                                </div>
                                {paymentMethod === 'institution' && <div className="w-4 h-4 rounded-full bg-lumex-blue border-4 border-white shadow-sm" />}
                            </button>
                        </div>

                        {paymentMethod === 'card' ? (
                            <div className="space-y-4 mb-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Card Details</label>
                                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-400 flex justify-between items-center">
                                        <span>•••• •••• •••• ••••</span>
                                        <div className="flex gap-2">
                                            <span>MM/YY</span>
                                            <span>CVC</span>
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-gray-400 italic mt-1">Mock checkout: No real payment data is collected.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4 mb-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Waiver / Voucher Code</label>
                                    <input
                                        type="text"
                                        placeholder="Enter code (e.g., LUMEX-TH24)"
                                        className="w-full p-3 bg-white border border-lumex-border rounded-lg text-sm outline-none focus:border-lumex-blue"
                                    />
                                </div>
                            </div>
                        )}

                        <Button
                            variant="primary"
                            className="w-full h-12 text-lg font-bold"
                            onClick={handlePayment}
                            disabled={processing}
                        >
                            {processing ? (
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Processing Payment...
                                </div>
                            ) : (
                                `Confirm & Pay $${apcAmount.toLocaleString()}`
                            )}
                        </Button>
                    </section>
                </div>
            </div>
        </Container>
    );
};
