import { Link } from 'react-router-dom';

const LinkTo = ({text, link}: {
    text: string;
    link: string;
}) => {
    return (
        <Link to={link} className="text-blue-500 hover:underline">
            {text}
        </Link>
    );
}

export default LinkTo;
