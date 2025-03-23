import PageLayout from "@/layouts/PageLayout.tsx";
import {ThemeProvider} from "@/components/theme-provider.tsx";
import { useEntityConnection } from '@/hooks/useEntityConnection'

function App() {
    useEntityConnection()

    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <PageLayout/>
        </ThemeProvider>
    )
}

export default App
