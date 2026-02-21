import { createContext, useContext, type ReactNode } from 'react';

type PageLoadingContextValue = {
    loading: boolean;
};

const PageLoadingContext = createContext<PageLoadingContextValue>({
    loading: false,
});

export function PageLoadingProvider({
    loading,
    children,
}: {
    loading: boolean;
    children: ReactNode;
}) {
    return (
        <PageLoadingContext.Provider value={{ loading }}>
            {children}
        </PageLoadingContext.Provider>
    );
}

export function usePageLoading(): boolean {
    return useContext(PageLoadingContext).loading;
}
