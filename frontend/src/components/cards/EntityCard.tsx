import { IEntity, EntitySchema, IVehicle, VehicleSchema } from "@/types/types.ts"

type TEntityCard = {
    entity: IEntity
    vehicle: IVehicle | undefined
}

export const EntityCard = ({ entity, vehicle }: TEntityCard) => {
    const entityResult = EntitySchema.safeParse(entity)
    const vehicleResult = vehicle ? VehicleSchema.safeParse(vehicle) : null

    if (!entityResult.success) {
        console.warn("❌ Entita neprošla validací v EntityCard:", entityResult.error.format())
        return (
            <div className="rounded-xl shadow p-4 border bg-white dark:bg-gray-900 text-red-600">
                Neplatná data entity
            </div>
        )
    }

    if (vehicle && !vehicleResult?.success) {
        console.warn("❌ Vozidlo neprošlo validací v EntityCard:", vehicleResult?.error.format())
    }

    const validEntity = entityResult.data
    const validVehicle = vehicleResult?.success ? vehicleResult.data : undefined

    return (
        <div className="rounded-xl shadow p-4 border flex flex-col gap-2 bg-white dark:bg-gray-900">
            <div className="flex items-center gap-3">
                <img
                    src={`/images/${validVehicle?.icon ?? "default.png"}`}
                    alt={validVehicle?.name ?? "Vozidlo"}
                    className="w-10 h-10"
                />
                <div className="flex flex-col">
                    <span className="font-bold">{validVehicle?.name ?? validEntity.vehicleId}</span>
                    <span className="text-sm text-muted-foreground">{validVehicle?.description}</span>
                </div>
            </div>

            <div className="text-sm">
                <strong>ID:</strong> {validEntity.id}
                <br />
                <strong>Team:</strong>{" "}
                <span className={validEntity.team === "Red" ? "text-red-500" : "text-blue-500"}>
                    {validEntity.team}
                </span>
                <br />
                <strong>Status:</strong> {validEntity.status}
            </div>
        </div>
    )
}
