import React from 'react';
import { Container } from '../../../shared/ui';

export const ContactPage: React.FC = () => {
    const [status, setStatus] = React.useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('submitting');

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setStatus('success');
    };

    return (
        <div className="py-12 bg-lumex-bg min-h-[70vh]">
            <Container>
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-serif font-bold text-lumex-text mb-4">
                            Contact Us
                        </h1>
                        <p className="text-xl text-lumex-muted leading-relaxed">
                            Have a question, feedback, or need support? We're here to help.
                        </p>
                    </div>

                    <div className="bg-lumex-card rounded-xl shadow-sm border border-lumex-border overflow-hidden flex flex-col md:flex-row">
                        <div className="md:w-1/3 bg-lumex-blue text-white p-8">
                            <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
                            <div className="space-y-6">
                                <div>
                                    <h3 className="font-semibold text-white/70 mb-1 uppercase tracking-wider text-xs">Customer Service</h3>
                                    <p>support@lumex.com</p>
                                    <p>+1 (800) 123-4567</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white/70 mb-1 uppercase tracking-wider text-xs">Editorial Office</h3>
                                    <p>editorial@lumex.com</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white/70 mb-1 uppercase tracking-wider text-xs">Headquarters</h3>
                                    <p>123 Science Way<br />Suite 100<br />New York, NY 10001</p>
                                </div>
                            </div>
                        </div>

                        <div className="md:w-2/3 p-8">
                            {status === 'success' ? (
                                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                                    <div className="w-16 h-16 bg-lumex-open-bg rounded-full flex items-center justify-center mb-6">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                                    </div>
                                    <h2 className="text-2xl font-bold text-lumex-text mb-2">Message Sent!</h2>
                                    <p className="text-lumex-muted mb-6">Thank you for reaching out. A member of our team will get back to you shortly.</p>
                                    <button
                                        onClick={() => setStatus('idle')}
                                        className="text-lumex-blue font-bold hover:underline"
                                    >
                                        Send another message
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={(e) => void handleSubmit(e)} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="firstName" className="block text-sm font-semibold text-lumex-text mb-1.5">First Name</label>
                                            <input required type="text" id="firstName" className="w-full px-4 py-2 bg-lumex-bg-white border border-lumex-border rounded text-lumex-text focus:outline-none focus:ring-2 focus:ring-lumex-blue/30 focus:border-lumex-blue" />
                                        </div>
                                        <div>
                                            <label htmlFor="lastName" className="block text-sm font-semibold text-lumex-text mb-1.5">Last Name</label>
                                            <input required type="text" id="lastName" className="w-full px-4 py-2 bg-lumex-bg-white border border-lumex-border rounded text-lumex-text focus:outline-none focus:ring-2 focus:ring-lumex-blue/30 focus:border-lumex-blue" />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-semibold text-lumex-text mb-1.5">Email Address</label>
                                        <input required type="email" id="email" className="w-full px-4 py-2 bg-lumex-bg-white border border-lumex-border rounded text-lumex-text focus:outline-none focus:ring-2 focus:ring-lumex-blue/30 focus:border-lumex-blue" />
                                    </div>
                                    <div>
                                        <label htmlFor="subject" className="block text-sm font-semibold text-lumex-text mb-1.5">Subject</label>
                                        <select required id="subject" className="w-full px-4 py-2 border border-lumex-border rounded text-lumex-text focus:outline-none focus:ring-2 focus:ring-lumex-blue/30 focus:border-lumex-blue bg-lumex-bg-white">
                                            <option value="">Select a topic</option>
                                            <option value="support">Technical Support</option>
                                            <option value="submission">Manuscript Submission</option>
                                            <option value="billing">Billing / Subscription</option>
                                            <option value="other">Other Inquiry</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="message" className="block text-sm font-semibold text-lumex-text mb-1.5">Message</label>
                                        <textarea required id="message" rows={5} className="w-full px-4 py-2 bg-lumex-bg-white border border-lumex-border rounded text-lumex-text focus:outline-none focus:ring-2 focus:ring-lumex-blue/30 focus:border-lumex-blue resize-none" />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={status === 'submitting'}
                                        className="px-6 py-3 bg-lumex-blue text-white font-bold rounded hover:bg-lumex-blue-dark transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {status === 'submitting' ? 'Sending...' : 'Send Message'}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
};
