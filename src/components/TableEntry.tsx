import LinkTo from '../components/LinkTo';

function TableEntry({ date, title, link }: { date: string; title: string, link?: string }) {
    return (
        <span className="flex items-center gap-2">
            <span className="text-gray-500">{date}</span>
            <LinkTo to={link} className="text" text={title} />
        </span >
    )
}

export default TableEntry;
