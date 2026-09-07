function Figure({ src, alt, className }: { src: string | undefined; alt?: string | undefined; className?: string | undefined }) {
    if (!src) {
        return <></>;
    }


    // shadow would be clipped by the mask, so the fade replaces it
    const classNames = className + " " + "rounded-lg mb-4 mx-auto fade-edges";
    return (
        <figure>
            <img src={src} alt={alt} className={classNames} />
        </figure>
    );
}

export default Figure;
