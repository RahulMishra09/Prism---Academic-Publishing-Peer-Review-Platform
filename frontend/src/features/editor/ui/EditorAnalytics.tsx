import React from 'react';

export const EditorAnalytics: React.FC = () => {
    // Mock data for trends
    const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
    const submissionData = [65, 78, 45, 92, 110, 125];
    const maxSubmissions = Math.max(...submissionData);

    const stats = [
        { label: 'Total Submissions (YTD)', value: '515', change: '+12%', positive: true },
        { label: 'Acceptance Rate', value: '18.4%', change: '-2%', positive: false },
        { label: 'Avg. Days to First Decision', value: '24.2', change: '-4.1d', positive: true },
        { label: 'Active Reviewers', value: '1,204', change: '+85', positive: true },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-white p-5 border border-lumex-border rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                        <div className="flex items-end justify-between">
                            <h3 className="text-2xl font-bold text-lumex-text">{stat.value}</h3>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${stat.positive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                                }`}>
                                {stat.change}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Submission Trends (SVG Chart) */}
                <div className="lg:col-span-2 bg-white p-6 border border-lumex-border rounded-xl shadow-sm">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="font-bold text-lumex-text">Submission Trends</h3>
                        <div className="flex gap-2">
                            <span className="flex items-center gap-1 text-[10px] font-bold text-gray-400">
                                <span className="w-2 h-2 rounded-full bg-lumex-blue" /> Actual
                            </span>
                            <span className="flex items-center gap-1 text-[10px] font-bold text-gray-400">
                                <span className="w-2 h-2 rounded-full bg-gray-200" /> Projected
                            </span>
                        </div>
                    </div>

                    <div className="relative h-64 flex items-end justify-between px-4 pb-8">
                        {/* Grid Lines */}
                        <div className="absolute inset-0 flex flex-col justify-between pb-8 pointer-events-none">
                            {[0, 1, 2, 3].map(i => <div key={i} className="w-full border-t border-gray-50" />)}
                        </div>

                        {submissionData.map((val, idx) => {
                            const height = (val / maxSubmissions) * 100;
                            return (
                                <div key={months[idx]} className="relative flex flex-col items-center group w-full">
                                    <div
                                        className="w-10 bg-lumex-blue/80 group-hover:bg-lumex-blue rounded-t-sm transition-all duration-500 relative cursor-help"
                                        style={{ height: `${height}%` }}
                                    >
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-lumex-text text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                            {val} submissions
                                        </div>
                                    </div>
                                    <span className="absolute -bottom-8 text-[10px] font-bold text-gray-400">{months[idx]}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Subject Distribution (CSS Rings/Progress) */}
                <div className="bg-white p-6 border border-lumex-border rounded-xl shadow-sm">
                    <h3 className="font-bold text-lumex-text mb-6">Processing Efficiency</h3>
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold text-gray-500">Peer Review (Avg 18d)</span>
                                <span className="text-xs font-bold text-lumex-blue">Within Goal</span>
                            </div>
                            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 w-[85%]" />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold text-gray-500">Editor Assign (Avg 2d)</span>
                                <span className="text-xs font-bold text-lumex-blue">Exceeding</span>
                            </div>
                            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 w-[95%]" />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold text-gray-500">Final Decision (Avg 5d)</span>
                                <span className="text-xs font-bold text-orange-500">Delayed</span>
                            </div>
                            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-orange-500 w-[60%]" />
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-100">
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <h4 className="text-[10px] font-bold text-lumex-blue uppercase mb-1">Editor Tip</h4>
                            <p className="text-[10px] text-lumex-text-secondary leading-normal">
                                Consider assigning more reviewers for "Quantum Computing" papers to reduce the backlog in that category.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Geographical Distribution Simulation */}
            <div className="bg-white p-6 border border-lumex-border rounded-xl shadow-sm">
                <h3 className="font-bold text-lumex-text mb-6">Top Contributing Regions</h3>
                <div className="flex flex-wrap gap-4">
                    {[
                        { name: 'North America', pct: 42, color: 'bg-blue-500' },
                        { name: 'Europe', pct: 31, color: 'bg-green-500' },
                        { name: 'Asia-Pacific', pct: 18, color: 'bg-amber-500' },
                        { name: 'Other', pct: 9, color: 'bg-gray-400' }
                    ].map(region => (
                        <div key={region.name} className="flex-1 min-w-[150px] p-4 border border-gray-100 rounded-lg flex items-center gap-4">
                            <div className={`w-3 h-3 rounded-full ${region.color}`} />
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase">{region.name}</p>
                                <p className="text-lg font-bold text-lumex-text">{region.pct}%</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
