import {IEntity} from "@/types/types.ts";

type TEntityCard = {
    entity: IEntity
    vehicle: Vehicle | undefined
}

export const EntityCard = ({entity, vehicle}: TEntityCard) => {
    return (
        <div className="rounded-xl shadow p-4 border flex flex-col gap-2 bg-white dark:bg-gray-900">
            <div className="flex items-center gap-3">
                <img
                    src={`/images/${vehicle?.icon ?? "default.png"}`}
                    alt={vehicle?.name}
                    className="w-10 h-10"
                />
                <div className="flex flex-col">
                    <span className="font-bold">{vehicle?.name ?? entity.vehicleId}</span>
                    <span className="text-sm text-muted-foreground">{vehicle?.description}</span>
                </div>
            </div>

            <div className="text-sm">
                <strong>ID:</strong> {entity.id}
                <br/>
                <strong>Team:</strong>{" "}
                <span className={entity.team === "Red" ? "text-red-500" : "text-blue-500"}>
          {entity.team}
        </span>
                <br/>
                <strong>Status:</strong> {entity.status}
            </div>
        </div>
    )
}
