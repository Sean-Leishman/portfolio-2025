// Credits for the artwork. Everything here comes from the Public Domain Image Archive; these four
// have known pages, so they get a full credit line under the image. Anything missing falls back to
// the general credit in the footer.
export type Credit = { title: string, artist: string, year: string, href: string };

export const credits: Record<string, Credit> = {
    '/src/assets/pdga/surprise-in-terror.webp': {
        title: 'Surprise in Terror', artist: 'Joseph Ducreux', year: 'ca. 1790',
        href: 'https://pdimagearchive.org/images/56ab8259-1d13-4e40-b90a-244e9ab66964/',
    },
    '/src/assets/pdga/kite-flying.webp': {
        title: 'Kite-flying scene', artist: 'Utagawa Hiroshige', year: '1797–1858',
        href: 'https://pdimagearchive.org/images/550b6149-6a7e-4a15-a98a-fd4cb5109950/',
    },
    '/src/assets/pdga/psychod.webp': {
        title: 'Large anses of Psychod.', artist: 'Hippolyte Baraduc', year: '1913',
        href: 'https://pdimagearchive.org/images/d00139ce-299b-4d19-946f-60c7de41fa1e/',
    },
    '/src/assets/pdga/carolina-duck.webp': {
        title: 'The Summer Duck', artist: 'Mark Catesby', year: '1754',
        href: 'https://pdimagearchive.org/images/6ef1e37d-f61e-45fd-890c-95617a1cee8f/',
    },
};

export function getCredit(src?: string) {
    return src ? credits[src] : undefined;
}

export const ARCHIVE = 'https://pdimagearchive.org';
