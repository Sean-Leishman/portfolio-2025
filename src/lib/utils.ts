export function extractLink(...args: any[]): string {
    if (args.length === 0) {
        return '';
    }
    let link = "/";
    for (const arg of args) {
        if (typeof arg === 'string') {
            link += (arg + "/");
        }
        else {
            console.warn("extractLink: Invalid argument type. Expected string, got", typeof arg);
        }
    }

    return link.replace(/\/+$/, ""); // Remove trailing slashes
}
