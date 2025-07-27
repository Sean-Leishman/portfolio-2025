import { Link } from 'react-router-dom';

const LinkTo = ({ text, to, underline = true, muted = false }: {
    text: string;
    to: string;
    underline?: boolean;
    muted?: boolean;
}) => {
    const isUnderline = underline ? 'underline' : '';
    const isMuted = muted ? 'text-muted-foreground' : 'text-black-500';
    const className = 'bold hover:underline ' + isUnderline + ' ' + isMuted;
    return (
        <Link to={to} className={className}>
            {text}
        </Link>
    );
}

export default LinkTo;
