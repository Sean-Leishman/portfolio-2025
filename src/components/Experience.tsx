function Experience({ company, role, date, logo, description }: { company: string, role: string, date: string, logo: string, description: string }) {
    return (
        <div className="flex justify-between gap-4 p-4 border-b border-gray-200 text-sm">
            <div className="flex justify-start items-center gap-4">
                <img src={logo} alt={`${company} logo`} className="w-10" />
                <h3>{role}</h3>
            </div>
            <div className="flex justify-end items-center gap-4 text-right text-xs text-gray-500">
                <p className="company-name">{company} - {date}{description}</p>
            </div>
        </div>
    );
}

export default Experience;
