import { Button } from "@/components/ui/button"
import { useEntityStore } from "@/hooks/useEntityStore"
import { getConnection } from "@/lib/signalr"
import { HubConnectionState } from "@microsoft/signalr"

export const SimulationControlPanel = () => {
    const { isSimulationRunning, setSimulationRunning, addLog } = useEntityStore()
    const connection = getConnection()

    const isConnected = connection.state === HubConnectionState.Connected

    const sendCommand = async (method: string, logMessage: string, updateState?: boolean) => {
        if (!isConnected) {
            console.warn("⚠️ Nelze odeslat příkaz – SignalR není připojen")
            addLog(`[${new Date().toLocaleTimeString()}] ❌ Nelze odeslat příkaz – připojení není aktivní`)
            return
        }

        try {
            await connection.invoke(method)
            addLog(`[${new Date().toLocaleTimeString()}] ${logMessage}`)
            if (typeof updateState === "boolean") {
                setSimulationRunning(updateState)
            }
        } catch (err) {
            console.error(`❌ Chyba při volání ${method}:`, err)
            addLog(`[${new Date().toLocaleTimeString()}] ❌ Chyba při příkazu ${method}`)
        }
    }

    return (
        <div className="p-4 space-y-2 flex flex-col gap-2">
            <Button
                onClick={() => sendCommand("ResumeSimulation", "▶️ Simulation started", true)}
                disabled={!isConnected || isSimulationRunning}
                variant="default"
            >
                ▶️ Start Simulation
            </Button>

            <Button
                onClick={() => sendCommand("PauseSimulation", "⏸️ Simulation paused", false)}
                disabled={!isConnected || !isSimulationRunning}
                variant="secondary"
            >
                ⏸️ Pause Simulation
            </Button>

            <Button
                onClick={() => sendCommand("ResetSimulation", "🔄 Simulation reset")}
                disabled={!isConnected}
                variant="destructive"
            >
                🔄 Reset Simulation
            </Button>
        </div>
    )
}
