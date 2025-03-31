import {create} from 'zustand'
import {IEntityState} from "@/types/types.ts";

export const useEntityStore = create<IEntityState>((set) => ({
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
