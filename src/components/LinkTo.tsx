import { Link } from 'react-router-dom';

const LinkTo = ({ text, to, underline = true, muted = false, customClassName = "" }: {
    text: string | undefined;
    to: string | undefined;
    underline?: boolean;
    muted?: boolean;
    customClassName?: string;
}) => {
    const isUnderline = underline ? 'underline' : '';
    const isMuted = muted ? 'text-muted-foreground' : 'text-black-500';
    const className = customClassName + ' hover:underline ' + isUnderline + ' ' + isMuted;

    if (!to) {
        return <span className={className}>{text}</span>;
    }

    return (
        <Link to={to} className={className}>
            {text}
        </Link>
    );
}

export default LinkTo;
