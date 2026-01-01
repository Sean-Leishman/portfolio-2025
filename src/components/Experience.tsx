import { useState } from 'react';

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

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded);
    };

    const hasAchievements = achievements && achievements.length > 0;
    const hasDetails = details && details.length > 0;
    const hasResponsibilities = responsibilities && responsibilities.length > 0;
    const hasSkills = skills && skills.length > 0;

    return (
        <div className="flex flex-col justify-start border-b border-gray-200 p-4">
            {/* Header Row */}
            <div
                className="flex justify-between text-sm cursor-pointer"
                onClick={toggleExpanded}
            >
                <div className="flex justify-start items-center gap-4">
                    <img src={logo} alt={`${company} logo`} className="w-5" />
                    <h3 className="font-semibold text-gray-800">{role}</h3>
                </div>
                <div className="flex justify-end items-center gap-4 text-right text-xs text-gray-500">
                    <p>{company} | {date}</p>
                    <span className={`text-blue-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                        ▼
                    </span>
                </div>
            </div>

            {/* Expandable Content */}
            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="mt-4 text-sm rounded-lg">
                    <div className="bg-gradient-to-br from-slate-50 to-gray-100 mx-2 px-5 py-4 rounded-xl border border-gray-200">

                        {/* Achievements Section */}
                        {hasAchievements && (
                            <div className="mb-3">
                                <h5 className="text-sm font-bold text-amber-700 mb-1.5">
                                    Achievements:
                                </h5>
                                <ul className="space-y-0.5 ml-1">
                                    {achievements!.map((achievement, index) => (
                                        <li
                                            key={index}
                                            className="text-gray-700 leading-relaxed before:content-['•'] before:mr-2 before:text-amber-600"
                                        >
                                            {achievement}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Details Section */}
                        {hasDetails && (
                            <div className="mb-3">
                                <h5 className="text-sm font-bold text-gray-700 mb-1.5">
                                    Details:
                                </h5>
                                <ul className="space-y-0.5 ml-1">
                                    {details!.map((detail, index) => (
                                        <li
                                            key={index}
                                            className="text-gray-600 leading-relaxed before:content-['•'] before:mr-2 before:text-gray-400"
                                        >
                                            {detail}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Responsibilities Section */}
                        {hasResponsibilities && (
                            <div className="mb-3">
                                <h5 className="text-sm font-bold text-gray-700 mb-1.5">
                                    Responsibilities:
                                </h5>
                                <ul className="space-y-0.5 ml-1">
                                    {responsibilities!.map((responsibility, index) => (
                                        <li
                                            key={index}
                                            className="text-gray-600 leading-relaxed before:content-['•'] before:mr-2 before:text-gray-400"
                                        >
                                            {responsibility}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Skills Section */}
                        {hasSkills && (
                            <div>
                                <h5 className="text-sm font-bold text-gray-700 mb-1.5">
                                    Skills:
                                </h5>
                                <div className="flex flex-wrap gap-2 ml-1">
                                    {skills!.map((skill, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 text-xs text-gray-600 bg-white rounded-full border border-gray-300"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Experience;
