import Experience from "./Experience";

function ExperienceList() {
    return (
        <div>
            <Experience company="University of Edinburgh" role="Undergraduate Student" date="2020 - Present" logo="/src/assets/uoe.jpg" achievements={["MInf Class Prize 2025"]} details={["Natural Language Generation, Understanding and Machine Translation", "Distributed Systems", "Parallel Programming Languages and Systems", "Mobile Robotics", "Text Technologies for Data Science", "Automatic Speech Recognition", "Operating Systems", "Introduction to Databases", "Computer Graphics: Rendering", "Algorithms and Data Strucutres", "Foundations of Data Science"]} />
            <Experience company="Squarepoint Capital" role="Software Engineer Intern" date="Summer 2024" logo="/src/assets/sqpc.png" responsibilities={["Understand and apply changes to the Time-Series Service", "Designed and implemented a PostgreSQL EXPLAIN-like functionality for TSS"]} skills={["C++", "Databases"]} />
            <Experience company="Coretech Security" role="Software Engineer Intern" date="Summer 2023" logo="/src/assets/coretech.png" responsibilities={["Develop and test a code obfuscation tool", "Training in designing secure software", "Design new concepts for the graduate recruitment program"]} skills={["C++"]} />
            <Experience company="Singapore Management University" role="Exchange Student" date="2023-2024" logo="/src/assets/smu.png" details={["Agent-based Modelling and Simulation", "Computer Security", "Data Security and Privacy", "Machine Learning", "Mobile-based Computing", "SMU-X Internet of Things"]} />


        </div>
    );
}

export default ExperienceList;
