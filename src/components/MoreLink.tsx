import LinkTo from './LinkTo';

// Shared "N more ... in all ..." footer under the truncated home lists.
function MoreLink({ remaining, noun, to, centered = false }: { remaining: number, noun: string, to: string, centered?: boolean }) {
    if (remaining <= 0) return null;
    const plural = `${noun}${remaining === 1 ? '' : 's'}`;
    return (
        <p className={`mt-6 text-sm italic text-muted-foreground ${centered ? 'text-center' : 'text-left'}`}>
            {`${remaining} more ${plural} in `}<LinkTo to={to} text={`all ${noun}s`} />
        </p>
    );
}

export default MoreLink;
