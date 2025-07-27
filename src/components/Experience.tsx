import { useState } from 'react';

function Experience({ company, role, date, logo, responsibilities, skills, achievements, details }: { company: string, role: string, date: string, logo: string, responsibilities?: string[], skills?: string[], achievements?: string[], details?: string[] }) {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded);
    };

    // clickable extension to expand description
    return (
        <div className="flex flex-col justify-start border-b border-gray-200 p-4">
            <div className="flex justify-between text-sm" onClick={toggleExpanded} style={{ cursor: 'pointer' }}>
                <div className="flex justify-start items-center gap-4">
                    <img src={logo} alt={`${company} logo`} className="w-5" />
                    <h3 className="font-semibold">{role}</h3>
                </div>
                <div className="flex justify-end items-center gap-4 text-right text-xs text-gray-500">
                    <p className="company-name">{company} | {date}</p>
                    {isExpanded ? (
                        <span className="text-blue-500">▲</span>
                    ) : (
                        <span className="text-blue-500">▼</span>
                    )}

                </div>
            </div>
            <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-128 opacity-100' : 'max-h-0 opacity-0'
                    }`}
            >
                <div className="mt-4 py-2 text-gray px-4 text-sm bg-gray-200 rounded-lg">
                    {
                        responsibilities && responsibilities.length > 0 && (
                            <div className="mb-2">
                                <span className="font-semibold italic">Responsibilities:</span>
                                <ul className="pl-2 list-disc list-inside">
                                    {responsibilities.map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        )
                    }
                    {
                        skills && skills.length > 0 && (
                            <div className="mb-2">
                                <span className="font-semibold italic">Skills:</span>
                                <ul className="pl-2 list-none flex">
                                    {skills.map((skill, index) => (
                                        <li key={index} className="mr-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                            {skill}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )
                    }
                    {
                        achievements && achievements.length > 0 && (
                            <div className="mb-2">
                                <span className="font-semibold italic">Achievements:</span>
                                <ul className="pl-2 list-disc list-inside">
                                    {achievements.map((skill, index) => (
                                        <li key={index} className="">
                                            {skill}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )
                    }
                    {
                        details && details.length > 0 && (
                            <div className="mb-2">
                                <p className="font-semibold italic">Details:</p>
                                <ul className="pl-2 list-disc list-inside">
                                    {details.map((skill, index) => (
                                        <li key={index}>
                                            {skill}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    );
}

export default Experience;
