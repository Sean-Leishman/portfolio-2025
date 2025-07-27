import LinkTo from '../components/LinkTo';

function TableEntry({ date, title, link }: { date: string | undefined; title: string | undefined, link?: string | undefined }) {
    return (
        <span className="flex items-center gap-2">
            <span className="text-gray-500 italic">{date}</span>
            <LinkTo to={link} text={title} customClassName="font-semibold" />
        </span >
    )
}

export default TableEntry;
