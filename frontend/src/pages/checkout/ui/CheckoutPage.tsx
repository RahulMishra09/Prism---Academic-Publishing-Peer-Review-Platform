import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button, Container, Input, Stack } from '@shared/ui';
import { useArticle } from '../../../entities/article/api/articleQueries';
import type { Author } from '../../../entities/article/model/types';

export const CheckoutPage: React.FC = () => {
    const { doi } = useParams<{ doi: string }>();
    const navigate = useNavigate();
    const { data: article, isLoading } = useArticle(doi || '');

    const [accessType, setAccessType] = useState<'48h' | 'perpetual'>('48h');
    const [isProcessing, setIsProcessing] = useState(false);

    if (isLoading) {
        return (
            <Container className="py-20 text-center">
                <p className="text-gray-500">Loading checkout...</p>
            </Container>
        );
    }

    if (!article) {
        return (
            <Container className="py-20 text-center">
                <h1 className="text-2xl font-bold text-gray-800">Article not found</h1>
                <p className="mt-4"><Link to="/" className="text-lumex-blue hover:underline">Return home</Link></p>
            </Container>
        );
    }

    const price = accessType === '48h' ? 39.95 : 59.95;

    const handleCheckout = (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        // Simulate payment processing
        setTimeout(() => {
            setIsProcessing(false);
            // In a real app, this would redirect to a success page or grant access
            alert(`Payment of $${price} successful! You now have access to "${article.title}".`);
            void navigate(`/article/${encodeURIComponent(doi || '')}`);
        }, 1500);
    };

    return (
        <Container className="py-12">
            <h1 className="text-3xl font-serif font-bold text-lumex-text mb-8">Checkout</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2">
                    {/* Order Summary */}
                    <section className="bg-white border border-lumex-border rounded-lg p-6 mb-8">
                        <h2 className="text-xl font-bold text-lumex-text mb-4 border-b border-lumex-border pb-2">
                            Item Details
                        </h2>
                        <div className="mb-4">
                            <h3 className="font-bold text-gray-800 mb-1 leading-snug">{article.title}</h3>
                            <p className="text-sm text-gray-600 mb-1">{article.authors.map((a: Author) => `${a.firstName} ${a.lastName}`).join(', ')}</p>
                            <p className="text-xs text-gray-500 italic">{article.journalTitle}</p>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-lumex-border">
                            <h4 className="font-bold text-sm text-gray-800">Select Access Option:</h4>

                            <label className={`block border rounded-lg p-4 cursor-pointer transition-colors ${accessType === '48h' ? 'bg-blue-50 border-lumex-blue' : 'border-gray-200 hover:border-blue-200'}`}>
                                <div className="flex justify-between items-start">
                                    <div className="flex gap-3">
                                        <input
                                            type="radio"
                                            name="accessType"
                                            value="48h"
                                            checked={accessType === '48h'}
                                            onChange={() => setAccessType('48h')}
                                            className="mt-1"
                                        />
                                        <div>
                                            <p className="font-bold text-lumex-text">48-hour Access</p>
                                            <p className="text-sm text-gray-600 mt-1">Read the full text online for 48 hours.</p>
                                        </div>
                                    </div>
                                    <span className="font-bold text-lg">$39.95</span>
                                </div>
                            </label>

                            <label className={`block border rounded-lg p-4 cursor-pointer transition-colors ${accessType === 'perpetual' ? 'bg-blue-50 border-lumex-blue' : 'border-gray-200 hover:border-blue-200'}`}>
                                <div className="flex justify-between items-start">
                                    <div className="flex gap-3">
                                        <input
                                            type="radio"
                                            name="accessType"
                                            value="perpetual"
                                            checked={accessType === 'perpetual'}
                                            onChange={() => setAccessType('perpetual')}
                                            className="mt-1"
                                        />
                                        <div>
                                            <p className="font-bold text-lumex-text">Perpetual Access</p>
                                            <p className="text-sm text-gray-600 mt-1">Read online and download PDF indefinitely.</p>
                                        </div>
                                    </div>
                                    <span className="font-bold text-lg">$59.95</span>
                                </div>
                            </label>
                        </div>
                    </section>
                </div>

                <div className="lg:col-span-1">
                    {/* Payment Info */}
                    <section className="bg-gray-50 border border-lumex-border rounded-lg p-6 sticky top-20">
                        <h2 className="text-xl font-bold text-lumex-text mb-6 border-b border-gray-200 pb-2">
                            Payment Details
                        </h2>

                        <form onSubmit={handleCheckout} className="space-y-5">
                            <Stack>
                                <label className="text-sm font-bold text-gray-700">Cardholder Name</label>
                                <Input placeholder="Name on card" required />
                            </Stack>
                            <Stack>
                                <label className="text-sm font-bold text-gray-700">Card Number</label>
                                <Input placeholder="0000 0000 0000 0000" required pattern="\d*" maxLength={16} />
                            </Stack>
                            <div className="flex gap-4">
                                <Stack className="flex-1">
                                    <label className="text-sm font-bold text-gray-700">Expiry</label>
                                    <Input placeholder="MM/YY" required maxLength={5} />
                                </Stack>
                                <Stack className="flex-1">
                                    <label className="text-sm font-bold text-gray-700">CVC</label>
                                    <Input placeholder="123" required maxLength={4} />
                                </Stack>
                            </div>

                            <div className="pt-6 border-t border-gray-200">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="font-bold text-gray-700">Total Price</span>
                                    <span className="font-bold text-2xl text-lumex-text">${price.toFixed(2)}</span>
                                </div>

                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="lg"
                                    className="w-full"
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? 'Processing Payment...' : `Pay $${price.toFixed(2)}`}
                                </Button>
                                <p className="text-xs text-center text-gray-500 mt-4 leading-relaxed">
                                    By processing this payment, you agree to our <Link to="/terms" className="text-lumex-blue hover:underline">Terms of Service</Link> and <Link to="/privacy-policy" className="text-lumex-blue hover:underline">Privacy Policy</Link>. This is a secure 256-bit encrypted transaction.
                                </p>
                            </div>
                        </form>
                    </section>
                </div>
            </div>
        </Container>
    );
};
