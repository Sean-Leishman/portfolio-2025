import TopBar from '../components/TopBar'
import Footer from '../components/Footer'
import ImageCredit from '../components/ImageCredit'

function Main({ imageSrc, children }: { imageSrc: string, children: React.ReactNode }) {
    return (
        <main>
            <div className="max-w-2xl mx-auto px-4 main-container">
                <TopBar />
                <div className="flex flex-col items-center mb-8">
                    <img src={imageSrc} alt="" fetchPriority="high" className="min-w-1/2 w-auto max-h-90 h-auto rounded-lg shadow-md" />
                    <ImageCredit src={imageSrc} className="mt-2" />
                </div>
                <div className="text-left">
                    {children}
                </div>
            </div>
            <Footer />
        </main>
    )
}

export default Main;
