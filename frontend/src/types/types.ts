export interface IEntity {
    id: string
    latitude: number
    longitude: number
    status: string
    vehicleId: string
    team: string
    affiliation: string
    battleDimension: string
    functionId: string
    symbolType: string
}

export interface IEntityState {
    entities: Record<string, IEntity>
    addOrUpdateEntity: (entity: IEntity) => void
    removeEntity: (id: string) => void
    reset: () => void
}

export interface IVehicle {
    vehicleId: string
    name: string
    type: string
    origin: string
    icon: string
    color: string
    description: string
}