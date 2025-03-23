import PageLayout from "@/layouts/PageLayout.tsx";
import {ThemeProvider} from "@/components/theme-provider.tsx";


function App() {


    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <PageLayout/>
        </ThemeProvider>
    )
}

export default App
