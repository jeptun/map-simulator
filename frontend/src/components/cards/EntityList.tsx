import {useVehicles} from "@/hooks/useVehicles.ts"
import {useEntityStore} from "@/hooks/useEntityStore.ts"
import {EntityCard} from "@/components/cards/EntityCard.tsx"

export const EntityList = () => {
    const {data: vehicles} = useVehicles()
    const {entities} = useEntityStore()

    return (
        <div className="grid grid-cols-1 gap-4">
            {Object.values(entities).map((entity) => {
                const vehicle = vehicles?.find((v) => v.vehicleId === entity.vehicleId)
                return <EntityCard key={entity.id} entity={entity} vehicle={vehicle}/>
            })}
        </div>
    )
}
