import { useState } from 'react';

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
        <div className="border-t border-border py-6">
            <div
                className={`flex items-baseline justify-between gap-x-6 gap-y-2 flex-wrap ${canExpand ? 'cursor-pointer group' : ''}`}
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
            >
                <h3 className="text-xl font-bold tracking-tight text-foreground group-hover:text-accent transition-colors">
                    {role}
                </h3>
                <div className="mono text-xs text-muted-foreground flex items-center gap-2 shrink-0">
                    <img src={logo} alt="" className="w-4 h-4 object-contain rounded-sm" />
                    <span>{company} · {date}</span>
                    {canExpand && (
                        <span className={`ml-1 transition-transform duration-300 ${isExpanded ? 'rotate-45' : ''}`}>+</span>
                    )}
                </div>
            </div>

            {/* grid 0fr -> 1fr animates to the content's real height, no max-h guessing */}
            <div className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100 mt-6' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                    {sections.map((s) => (
                        <Section key={s.label} label={s.label} items={s.items} />
                    ))}

                    {!!skills?.length && (
                        <div className="flex flex-wrap gap-2">
                            {skills.map((skill, i) => (
                                <span key={i} className="mono px-2.5 py-1 text-xs text-muted-foreground border border-border rounded-full">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Experience;
