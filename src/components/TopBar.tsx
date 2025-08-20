import LinkTo from './LinkTo';

const TopBar = () => {
    return (
        <div className="flex justify-center items-center font-sans font-bold min-h-24">
            <nav className="w-full">
                <ul className="flex justify-between font-[1000]">
                    <li><a href="/" className="hover:underline"><span className="text-accent">x</span>xx</a></li>
                    <li>
                        <LinkTo to="/posts" text="posts" underline={false} muted={true} />
                    </li>
                    <li>
                        <LinkTo to="/projects" text="projects" underline={false} muted={true} />
                    </li>
                </ul>
            </nav>
        </div>
    )
}

export default TopBar;
