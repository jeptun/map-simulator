import {z} from "zod"

export const StepSchema = z.object({
    latitude: z.number(),
    longitude: z.number(),
})

export type IGeoStep = z.infer<typeof StepSchema>


// Zod schéma pro entitu z backendu
export const EntitySchema = z.object({
    id: z.string(),
    vehicleId: z.string(),
    latitude: z.number(),
    longitude: z.number(),
    status: z.string(),
    team: z.string(),
    affiliation: z.string(),
    battleDimension: z.string(),
    symbolType: z.string(),
    functionId: z.string(),
    steps: z.array(StepSchema).optional(),
})

export type IEntity = z.infer<typeof EntitySchema>

// Zod schéma pro vozidlo z REST API
export const VehicleSchema = z.object({
    vehicleId: z.string(),
    name: z.string(),
    type: z.string(),
    origin: z.string(),
    icon: z.string(),
    color: z.string(),
    description: z.string(),
})

export type IVehicle = z.infer<typeof VehicleSchema>


// Stavová struktura Zustand store
export interface IEntityState {
    entities: Record<string, IEntity>
    addOrUpdateEntity: (entity: IEntity) => void
    removeEntity: (id: string) => void
    reset: () => void
    selectedEntityId: string | null
    setSelectedEntityId: (id: string | null) => void
    logs: string[]
    addLog: (msg: string) => void
    isSimulationRunning: boolean
    setSimulationRunning: (running: boolean) => void
    addStepToEntity: (id: string, step: IGeoStep) => void
}

