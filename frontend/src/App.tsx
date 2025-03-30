import {scan} from "react-scan";
import PageLayout from "@/layouts/PageLayout.tsx";
import {ThemeProvider} from "@/components/theme-provider.tsx";
import {useEntityConnection} from '@/hooks/useEntityConnection'
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";

scan({
    enabled: false
})

function App() {
    const queryClient = new QueryClient()
    useEntityConnection()

    return (
        <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <PageLayout/>
        </ThemeProvider>
            <ReactQueryDevtools initialIsOpen={false}/>
        </QueryClientProvider>
    )
}

export default App
