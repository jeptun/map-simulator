import {create} from 'zustand'

export type Entity = {
    id: string
    latitude: number
    longitude: number
    status: string
    vehicleId: string
}

type EntityState = {
    entities: Record<string, Entity>
    addOrUpdateEntity: (entity: Entity) => void
    removeEntity: (id: string) => void
    reset: () => void
}

export const useEntityStore = create<EntityState>((set) => ({
    entities: {},

    addOrUpdateEntity: (entity) =>
        set((state) => ({
            entities: {
                ...state.entities,
                [entity.id]: entity,
            },
        })),

    removeEntity: (id) =>
        set((state) => {
            const newEntities = {...state.entities}
            delete newEntities[id]
            return {entities: newEntities}
        }),

    reset: () => set({entities: {}}),
}))
