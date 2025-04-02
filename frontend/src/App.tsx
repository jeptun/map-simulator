import {scan} from "react-scan"
import PageLayout from "@/layouts/PageLayout"
import {ThemeProvider} from "@/components/theme-provider"
import {QueryClient, QueryClientProvider} from "@tanstack/react-query"
import {ReactQueryDevtools} from "@tanstack/react-query-devtools"
import {LoadingScreen} from "@/components/LoadingScreen"
import {useEntityConnection} from "@/hooks/useEntityConnection"
import {useVehicles} from "@/hooks/useVehicles"
import { useEffect, useState } from "react"
scan({ enabled: false })



function AppContent() {
    const { status } = useVehicles()
    const isWsConnected = useEntityConnection()

    const [waitedTooLong, setWaitedTooLong] = useState(false)

    useEffect(() => {
        const timeout = setTimeout(() => {
            setWaitedTooLong(true)
        }, 5000)
        return () => clearTimeout(timeout)
    }, [])

    const isLoading = status !== "success" || (!isWsConnected && !waitedTooLong)
    if (isLoading) return <LoadingScreen />

    if (!isWsConnected) {
        console.warn("⚠️ WebSocket se nepřipojil do 5s. Pokračujeme bez něj.")
    }

    return <PageLayout />
}


function App() {
    const queryClient = new QueryClient()

    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                <AppContent />
            </ThemeProvider>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    )
}

export default App
