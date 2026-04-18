import React from 'react';

export interface MetricItem {
    label: string;
    value: string | number;
    subValue?: string;
    trend?: 'up' | 'down' | 'neutral';
}

export interface MetricsPanelProps {
    metrics: MetricItem[];
    title?: string;
    className?: string;
    layout?: 'row' | 'grid' | 'column';
}

export const MetricsPanel: React.FC<MetricsPanelProps> = ({
    metrics,
    title = 'Journal Metrics',
    className,
    layout = 'grid',
}) => {
    if (!metrics || metrics.length === 0) return null;

    return (
        <div
            className={`bg-lumex-bg-light p-4 md:p-6 border-t-4 border-lumex-blue shadow-sm ${className || ''}`}
        >
            {title && (
                <h3 className="text-lg font-serif font-bold text-lumex-text mb-4">{title}</h3>
            )}

            <div
                className={`
        ${layout === 'grid' ? 'grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6' : ''}
        ${layout === 'row' ? 'flex flex-wrap gap-6 md:gap-8 justify-between' : ''}
        ${layout === 'column' ? 'flex flex-col gap-4' : ''}
      `}
            >
                {metrics.map((metric) => (
                    <div key={metric.label} className="flex flex-col group">
                        <div className="flex items-end gap-2 mb-1">
                            <span className="text-2xl md:text-3xl font-bold text-lumex-blue leading-none">
                                {metric.value}
                            </span>
                            {metric.trend && (
                                <div className="flex gap-[2px] h-4 items-end mb-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                    {[
                                        { id: 't1', h: 0.4 }, { id: 't2', h: 0.6 },
                                        { id: 't3', h: 0.5 }, { id: 't4', h: 0.8 },
                                        { id: 't5', h: 0.7 }, { id: 't6', h: 0.9 }
                                    ].map((t, i) => (
                                        <div
                                            key={t.id}
                                            className={`w-1 rounded-t-sm transition-all duration-500 ease-out ${metric.trend === 'up' ? 'bg-green-500' : 'bg-lumex-blue'
                                                }`}
                                            style={{ height: `${t.h * 100}%`, transitionDelay: `${i * 50}ms` }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                        <span className="text-[11px] uppercase tracking-wider font-bold text-lumex-sub">
                            {metric.label}
                        </span>
                        {metric.subValue && (
                            <span className="text-[10px] text-gray-400 mt-0.5">{metric.subValue}</span>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-4 pt-4 border-t border-lumex-border text-xs text-right text-gray-500">
                <a href="#" className="text-lumex-blue hover:underline">
                    Learn more about our metrics
                </a>
            </div>
        </div>
    );
};
