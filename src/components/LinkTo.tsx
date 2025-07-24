import { Link } from 'react-router-dom';

const LinkTo = ({ text, to }: {
    text: string;
    to: string;
}) => {
    return (
        <Link to={to} className="text-blue-500 hover:underline">
            {text}
        </Link>
    );
}

export default LinkTo;
