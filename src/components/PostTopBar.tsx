import LinkTo from './LinkTo';
import Figure from './Figure';

function PostTopBar({ backLink, imageSrc }: { backLink: string; imageSrc: string; }) {
    let linkto = <LinkTo to={backLink} className="btn btn-ghost" text="<<<" />;
    if (!backLink) {
        linkto = <></>;
    }

    return (
        <div>
            {linkto}
            <Figure className="icon icon-back" src={imageSrc} />
        </div>

    )
}

export default PostTopBar;
