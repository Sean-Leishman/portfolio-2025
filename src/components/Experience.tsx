import { useState } from 'react';

function Experience({ company, role, date, logo, responsibilities, skills, achievements, details }: { company: string, role: string, date: string, logo: string, responsibilities?: string[], skills?: string[], achievements?: string[], details?: string[] }) {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded);
    };

    let achievements_section = <div></div>;
    if (!achievements || achievements.length === 0) {
        achievements = [];
    }
    else {
        achievements_section = (<div className="mb-4">
            <h5 className="text-base font-bold text-gray-800 mb-2 flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-amber-400 to-orange-500 rounded-full"></span>
                Achievements:
            </h5>
            <div className="space-y-2">
                {achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center gap-3 group">
                        <div className="w-2 h-2 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full group-hover:scale-125 transition-transform duration-200"></div>
                        <span className="text-gray-700 font-medium group-hover:text-gray-900 transition-colors duration-200">{achievement}</span>
                    </div>
                ))}
            </div>
        </div>);
    }

    let details_section = <div></div>;
    if (!details || details.length === 0) {
        details = [];
    }
    else {
        details_section = (<div>
            <h5 className="text-base font-bold text-gray-800 mb-2 flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></span>
                Details:
            </h5>
            <div className="flex flex-col">
                {details.map((detail, index) => (
                    <div key={index} className="flex items-start gap-3 group py-1">
                        <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mt-2 group-hover:scale-150 transition-all duration-200 shadow-sm"></div>
                        <span className="text-gray-700 leading-relaxed group-hover:text-gray-900 transition-colors duration-200 flex-1">{detail}</span>
                    </div>
                ))}
            </div>
        </div>
        );
    }

    let responsibilities_section = <div></div>;
    if (!responsibilities || responsibilities.length === 0) {
        responsibilities = [];
    }
    else {
        responsibilities_section = (<div>
            <h5 className="text-base font-bold text-gray-800 mb-2 flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-green-400 to-green-600 rounded-full"></span>
                Responsibilities:
            </h5>
            <ul className="list-disc list-inside space-y-1">
                {responsibilities.map((responsibility, index) => (
                    <li key={index} className="text-gray-700 leading-relaxed">{responsibility}</li>
                ))}
            </ul>
        </div>);
    }

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
                <div className="mt-4 text-gray text-sm rounded-lg">
                    <div className="bg-gradient-to-br from-slate-50 to-gray-100 mx-2 px-4 py-2 pt-3 rounded-xl border border-gray-200">
                        {/* Achievements Section */}
                        {achievements_section}

                        {/* Details Section */}
                        {details_section}

                        {/* Responsibilities Section */}
                        {responsibilities_section}

                        {/* Skills Section */}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Experience;
