function Figure({ src, alt, className }: { src: string; alt?: string; className?: string }) {
    if (!src) {
        return <></>;
    }

    console.log(`Figure: src=${src}, alt=${alt}, className=${className}`);

    return (
        <figure>
            <img src={src} alt={alt} className={className} />
            <figcaption>{alt}</figcaption>
        </figure>
    );
}

export default Figure;
