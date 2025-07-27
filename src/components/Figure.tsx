function Figure({ src, alt, className }: { src: string | undefined; alt?: string | undefined; className?: string | undefined }) {
    if (!src) {
        return <></>;
    }


    const classNames = className + " " + "rounded-lg shadow-md mb-4 mx-auto";
    return (
        <figure>
            <img src={src} alt={alt} className={classNames} />
        </figure>
    );
}

export default Figure;
