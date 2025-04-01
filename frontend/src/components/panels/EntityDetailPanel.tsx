import {useEntityStore} from "@/hooks/useEntityStore"
import {useVehicles} from "@/hooks/useVehicles"
// import { cn } from "@/lib/utils" // pokud nemáš utilitu na className merging, odeber to
import {Button} from "@/components/ui/button"

export const EntityDetailPanel = () => {
    const {selectedEntityId, entities, addOrUpdateEntity, addLog} = useEntityStore()
    const {data: vehicles} = useVehicles()

    const entity = selectedEntityId ? entities[selectedEntityId] : null
    const vehicle = vehicles?.find(v => v.vehicleId === entity?.vehicleId)

    if (!entity) {
        return <div className="p-4 text-muted-foreground">Vyberte entitu kliknutím na mapu…</div>
    }

    const handleStatusChange = (newStatus: string) => {
        if (newStatus === entity.status) return

        addOrUpdateEntity({
            ...entity,
            status: newStatus
        })

        addLog(`[${new Date().toLocaleTimeString()}] ${entity.id} status → ${newStatus}`)
    }

    return (
        <div className="p-4 space-y-4">
            <div>
                <h2 className="text-lg font-bold">{vehicle?.name ?? entity.vehicleId}</h2>
                <p className="text-sm text-muted-foreground">{vehicle?.description}</p>
            </div>

            <div className="text-sm space-y-1">
                <p><strong>ID:</strong> {entity.id}</p>
                <p><strong>Status:</strong> {entity.status}</p>
                <p><strong>Tým:</strong> {entity.team}</p>
            </div>

            <div className="flex flex-wrap gap-2">
                {["Idle", "Moving", "Firing", "Destroyed"].map((status) => (
                    <Button
                        key={status}
                        variant={status === entity.status ? "default" : "outline"}
                        onClick={() => handleStatusChange(status)}
                    >
                        {status}
                    </Button>
                ))}
            </div>
        </div>
    )
}
