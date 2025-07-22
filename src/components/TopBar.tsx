const TopBar = () => {
    return (
        <div className="flex justify-center items-center font-sans min-h-24">
            <nav className="w-full">
                <ul className="flex justify-between">
                    <li><a href="#home" className="hover:underline">XXX</a></li>
                    <li><a href="#about" className="text-muted hover:underline">About</a></li>
                    <li><a href="#contact" className="text-muted hover:underline">Contact</a></li>
                </ul>
            </nav>
        </div>
    )
}

export default TopBar;
