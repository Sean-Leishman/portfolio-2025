'use client';

import { toast } from 'sonner';


const EmailLink = () => {
    const encodedEmail = [
        108,
        101,
        105,
        115,
        104,
        109,
        97,
        110,
        115,
        101,
        97,
        110,
        64,
        103,
        109,
        97,
        105,
        108,
        46,
        99,
        111,
        109
    ]
    const decodeEmail = (encodedArray: number[]) => {
        return String.fromCharCode(...encodedArray)
    }

    const email = decodeEmail(encodedEmail);

    const handleClick = () => {
        const textArea = document.createElement('textarea');
        textArea.value = email;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        toast.success('Email copied to clipboard!', {
            duration: 1000,
            richColors: true,
            icon: '📋',
        });
    };


    return (
        <div className="flex items-center justify-center">
            <button
                onClick={handleClick}
                className="text-accent font-bold hover:underline cursor-pointer"
                aria-label="Copy email to clipboard"
            >
                Email Me
            </button>
        </div>
    );
}

export default EmailLink;
