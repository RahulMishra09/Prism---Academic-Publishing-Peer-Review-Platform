import React, { useEffect, useState } from 'react';
import type { ArticleSection } from '../../../entities/article/model/types';
import { clsx } from 'clsx';

export interface ArticleTableOfContentsProps {
    sections: ArticleSection[];
    className?: string;
}

export const ArticleTableOfContents: React.FC<ArticleTableOfContentsProps> = ({
    sections,
    className,
}) => {
    const [activeSectionId, setActiveSectionId] = useState<string>('');

    // Flatten sections for intersection observing
    const flatSections = React.useMemo(() => {
        const flattened: ArticleSection[] = [];
        const flatten = (items: ArticleSection[]) => {
            items.forEach(item => {
                flattened.push(item);
                if (item.subsections) flatten(item.subsections);
            });
        };
        flatten(sections);
        return flattened;
    }, [sections]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                // Find all intersecting entries
                const visibleEntries = entries.filter(entry => entry.isIntersecting);

                if (visibleEntries.length > 0) {
                    // Sort by ratio to find the most prominent one, or just take the first
                    setActiveSectionId(visibleEntries[0].target.id);
                }
            },
            {
                rootMargin: '-10% 0px -80% 0px', // Trigger when section hits top 10%
                threshold: 0.1,
            }
        );

        // Observe all section headers
        flatSections.forEach(section => {
            const elm = document.getElementById(section.id);
            if (elm) observer.observe(elm);
        });

        return () => observer.disconnect();
    }, [flatSections]);

    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            // Adjust offset for fixed headers
            const y = element.getBoundingClientRect().top + window.scrollY - 100;
            window.scrollTo({ top: y, behavior: 'smooth' });
            // Small delay to ensure state updates after scrolling
            setTimeout(() => setActiveSectionId(id), 50);
        }
    };

    const renderNavItems = (items: ArticleSection[]) => {
        return (
            <ul className="space-y-2">
                {items.map(section => (
                    <li
                        key={section.id}
                        className={clsx(
                            'pl-2',
                            section.level > 1 && 'ml-4 border-l border-lumex-border'
                        )}
                    >
                        <a
                            href={`#${section.id}`}
                            onClick={e => scrollToSection(e, section.id)}
                            className={clsx(
                                'block text-sm py-1 transition-colors duration-200',
                                activeSectionId === section.id
                                    ? 'text-lumex-blue font-bold border-l-2 border-lumex-blue -ml-[3px] pl-[9px]'
                                    : 'text-lumex-muted hover:text-lumex-blue'
                            )}
                        >
                            {section.title}
                        </a>
                        {section.subsections &&
                            section.subsections.length > 0 &&
                            renderNavItems(section.subsections)}
                    </li>
                ))}
            </ul>
        );
    };

    if (!sections || sections.length === 0) return null;

    return (
        <nav
            className={`bg-lumex-card border border-lumex-border rounded-lg p-4 shadow-sm transition-colors duration-200 ${className || ''}`}
        >
            <h3 className="text-lg font-serif font-bold text-lumex-text mb-4 uppercase tracking-wide">
                Sections
            </h3>
            {renderNavItems(sections)}
        </nav>
    );
};
