import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Button } from '@shared/ui';
import { fetchClient } from '../../../shared/api/base';

export const APCCheckoutPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'institution'>('card');
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');

    const apcAmount = 2750;

    const handlePayment = async () => {
        setProcessing(true);
        setError('');

        try {
            await fetchClient(`/checkout/apc/${id}`, {
                method: 'POST',
                body: JSON.stringify({ paymentMethod }),
            });
            void navigate('/account');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Payment failed. Please try again.');
        } finally {
            setProcessing(false);
        }
    };

    return (
        <Container className="py-12 max-w-4xl">
            <div className="mb-10 text-center">
                <h1 className="text-3xl font-serif font-bold text-lumex-text mb-2">Article Processing Charge (APC)</h1>
                <p className="text-lumex-text-secondary italic">Manuscript ID: {id}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <section className="bg-lumex-card p-6 border border-lumex-border rounded-xl shadow-sm">
                        <h2 className="text-lg font-bold text-lumex-text mb-6 pb-2 border-b border-lumex-border">Publication Summary</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-lumex-muted">Service</span>
                                <span className="font-bold text-lumex-text">Gold Open Access</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-lumex-muted">Journal</span>
                                <span className="font-bold text-lumex-text">Lumex Medicine</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-lumex-muted">Processing Fee</span>
                                <span className="font-bold text-lumex-text">${apcAmount.toLocaleString()}.00</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-lumex-muted">Taxes (VAT/GST)</span>
                                <span className="font-bold text-lumex-text">$0.00</span>
                            </div>
                            <div className="pt-4 border-t border-lumex-border flex justify-between items-center">
                                <span className="text-lg font-bold text-lumex-text">Total Due</span>
                                <span className="text-2xl font-bold text-lumex-blue">${apcAmount.toLocaleString()}.00</span>
                            </div>
                        </div>
                    </section>

                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-800/40 rounded-lg">
                        <p className="text-xs text-yellow-800 dark:text-yellow-300 leading-relaxed">
                            <span className="font-bold">Note:</span> Many institutions have agreements with Lumex to cover APCs. If you believe your institution covers this fee, please select "Institutional Waiver".
                        </p>
                    </div>
                </div>

                <div className="space-y-6">
                    <section className="bg-lumex-card p-6 border border-lumex-border rounded-xl shadow-sm">
                        <h2 className="text-lg font-bold text-lumex-text mb-6 pb-2 border-b border-lumex-border">Payment Method</h2>
                        <div className="space-y-3 mb-8">
                            <button
                                onClick={() => setPaymentMethod('card')}
                                className={`w-full flex items-center justify-between p-4 border rounded-lg transition-all ${paymentMethod === 'card' ? 'border-lumex-blue bg-lumex-blue/10 ring-1 ring-lumex-blue' : 'border-lumex-border hover:border-lumex-muted'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <svg className="text-lumex-muted" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>
                                    <span className="text-sm font-bold text-lumex-text">Credit / Debit Card</span>
                                </div>
                                {paymentMethod === 'card' && <div className="w-4 h-4 rounded-full bg-lumex-blue border-4 border-lumex-card shadow-sm" />}
                            </button>

                            <button
                                onClick={() => setPaymentMethod('institution')}
                                className={`w-full flex items-center justify-between p-4 border rounded-lg transition-all ${paymentMethod === 'institution' ? 'border-lumex-blue bg-lumex-blue/10 ring-1 ring-lumex-blue' : 'border-lumex-border hover:border-lumex-muted'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <svg className="text-lumex-muted" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>
                                    <span className="text-sm font-bold text-lumex-text">Institutional Waiver / Voucher</span>
                                </div>
                                {paymentMethod === 'institution' && <div className="w-4 h-4 rounded-full bg-lumex-blue border-4 border-lumex-card shadow-sm" />}
                            </button>
                        </div>

                        {paymentMethod === 'card' ? (
                            <div className="space-y-4 mb-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-lumex-sub uppercase tracking-widest">Card Details</label>
                                    <div className="p-3 bg-lumex-bg-deep border border-lumex-border rounded-lg text-sm text-lumex-sub flex justify-between items-center">
                                        <span>**** **** **** ****</span>
                                        <div className="flex gap-2">
                                            <span>MM/YY</span>
                                            <span>CVC</span>
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-lumex-sub italic mt-1">Payment will be processed via the backend checkout API.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4 mb-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-lumex-sub uppercase tracking-widest">Waiver / Voucher Code</label>
                                    <input
                                        type="text"
                                        placeholder="Enter code (e.g., LUMEX-TH24)"
                                        className="w-full p-3 bg-lumex-bg-deep border border-lumex-border rounded-lg text-sm text-lumex-text outline-none focus:border-lumex-blue"
                                    />
                                </div>
                            </div>
                        )}

                        {error && (
                            <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded px-3 py-2 mb-4">
                                {error}
                            </p>
                        )}

                        <Button
                            variant="primary"
                            className="w-full h-12 text-lg font-bold"
                            onClick={() => void handlePayment()}
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
