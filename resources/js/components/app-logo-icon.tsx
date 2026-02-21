import type { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            src="/images/company-logo.png"
            alt="Migrants Venture Corporation"
            {...props}
            className="size-full object-contain"
        />
    );
}
