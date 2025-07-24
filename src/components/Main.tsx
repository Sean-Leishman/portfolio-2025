import TopBar from '../components/TopBar'

function Main({ imageSrc, children }: { imageSrc: string, children: React.ReactNode }) {
    return (
        <main>
            <div className="max-w-2xl mx-auto px-4">
                <TopBar />
                <div className="flex justify-center items-center mb-8">
                    <img src={imageSrc} alt="Main Image" className="w-3/4 h-auto rounded-lg shadow-md" />
                </div>
                <div className="text-left">
                    {children}
                </div>
            </div>
        </main>
    )
}

export default Main;
