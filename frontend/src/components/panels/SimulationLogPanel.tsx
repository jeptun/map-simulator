import {useEntityStore} from "@/hooks/useEntityStore"
import {ScrollArea} from "@/components/ui/scroll-area"
import {Button} from "@/components/ui/button"
import {Trash2} from "lucide-react" // nebo jakoukoliv jinou ikonu

export const SimulationLogPanel = () => {
    const logs = useEntityStore((state) => state.logs)
    const clearLogs = useEntityStore((state) => state.clearLogs)

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center justify-between px-4 py-2 border-b">
                <span className="text-lg font-semibold">📝 Log simulace</span>
                <Button
                    size="icon"
                    variant="ghost"
                    onClick={clearLogs}
                    title="Vymazat log"
                >
                    <Trash2 className="w-4 h-4"/>
                </Button>
            </div>

            <ScrollArea className="flex-1 p-4">
                <ul className="space-y-1 text-sm text-muted-foreground">
                    {logs.length === 0 && <li>Žádné události zatím</li>}
                    {logs.map((log, i) => (
                        <li key={i} className="whitespace-nowrap">
                            {log}
                        </li>
                    ))}
                </ul>
            </ScrollArea>
        </div>
    )
}
