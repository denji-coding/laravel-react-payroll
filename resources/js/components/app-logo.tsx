import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <div className="flex w-full flex-col items-center gap-2 py-1 group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:py-0">
            <div className="flex aspect-square size-25 shrink-0 items-center justify-center overflow-hidden rounded-full  bg-transparent group-data-[collapsible=icon]:size-8">
                <AppLogoIcon className="size-8 shrink-0 object-contain group-data-[collapsible=icon]:size-6" />
            </div>
            <div className="min-w-0 flex-1 text-center text-[1.1rem] font-bold group-data-[collapsible=icon]:hidden">
                <span className="block font-sans leading-tight font-bold text-white">
                    Migrants Venture Corporation
                </span>
            </div>
        </div>
    );
}
