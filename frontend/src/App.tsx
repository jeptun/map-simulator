import {scan} from "react-scan";
import PageLayout from "@/layouts/PageLayout.tsx";
import {ThemeProvider} from "@/components/theme-provider.tsx";
import {useEntityConnection} from '@/hooks/useEntityConnection'

scan({
    enabled: false
})

function App() {
    useEntityConnection()

    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <PageLayout/>
        </ThemeProvider>
    )
}

export default App
