import { useState } from 'react';

import { EntryHeader, EntryRow, Tags } from './Entry';

function Section({ label, items }: { label: string; items: string[] }) {
    return (
        <div className="mb-5">
            <p className="eyebrow mb-2">{label}</p>
            <ul className="space-y-1">
                {items.map((item, i) => (
                    <li key={i} className="text-sm leading-relaxed text-foreground/80 pl-4 -indent-4 before:content-['—'] before:mr-2 before:text-muted-foreground">
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    );
}

function Experience({
    company,
    role,
    date,
    logo,
    responsibilities,
    skills,
    achievements,
    details
}: {
    company: string,
    role: string,
    date: string,
    logo: string,
    responsibilities?: string[],
    skills?: string[],
    achievements?: string[],
    details?: string[]
}) {
    const [isExpanded, setIsExpanded] = useState(false);

    const sections = [
        { label: 'Achievements', items: achievements },
        { label: 'Responsibilities', items: responsibilities },
        { label: 'Details', items: details },
    ].filter((s): s is { label: string; items: string[] } => !!s.items?.length);

    const canExpand = sections.length > 0 || !!skills?.length;

    return (
        <EntryRow>
            <EntryHeader
                className={canExpand ? 'cursor-pointer group' : ''}
                onClick={() => canExpand && setIsExpanded(!isExpanded)}
                role={canExpand ? 'button' : undefined}
                tabIndex={canExpand ? 0 : undefined}
                aria-expanded={canExpand ? isExpanded : undefined}
                onKeyDown={(e) => {
                    if (canExpand && (e.key === 'Enter' || e.key === ' ')) {
                        e.preventDefault();
                        setIsExpanded(!isExpanded);
                    }
                }}
                title={<span className="group-hover:text-accent transition-colors">{role}</span>}
                meta={
                    <>
                        <img src={logo} alt="" className="w-4 h-4 object-contain rounded-sm" />
                        <span>{company} · {date}</span>
                        {canExpand && (
                            <span className={`transition-transform duration-150 ease-out ${isExpanded ? 'rotate-45' : ''}`}>+</span>
                        )}
                    </>
                }
            />

            {/* grid 0fr -> 1fr animates to the content's real height, no max-h guessing.
                150ms ease-out, and the top gap lives inside the clipped box: as a toggled mt-6 it
                snapped instantly while the height was still animating, which read as a jump. */}
            <div className={`grid transition-[grid-template-rows,opacity] duration-150 ease-out ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden"><div className="pt-4">
                    {sections.map((s) => (
                        <Section key={s.label} label={s.label} items={s.items} />
                    ))}

                    <Tags items={skills} />
                </div></div>
            </div>
        </EntryRow>
    );
}

export default Experience;
