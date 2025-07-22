import TopBar from '../components/TopBar'

function Main({ children }: { children: React.ReactNode }) {
    return (
        <main>
            <div className="max-w-2xl mx-auto px-4">
                <TopBar />
                <div className="text-left">
                    {children}
                </div>
            </div>
        </main>
    )
}

export default Main;
