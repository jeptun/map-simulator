import {create} from 'zustand'
import {IEntityState} from "@/types/types.ts";

export const useEntityStore = create<IEntityState>((set) => ({
    entities: {},
    logs: [],
    isSimulationRunning: false,
    selectedEntityId: null,

    // Přidání entity
    addOrUpdateEntity: (entity) =>
        set((state) => ({
            entities: {
                ...state.entities,
                [entity.id]: entity,
            },
        })),

    // Smazání entity
    removeEntity: (id) =>
        set((state) => {
            const newEntities = {...state.entities}
            delete newEntities[id]
            return {entities: newEntities}
        }),

    // reset stavu
    reset: () => set({entities: {}}),



    // Setter pro změnu výběru
    setSelectedEntityId: (id) => set({selectedEntityId: id}),

    // Setter pro zobrazení logu
    addLog: (msg: string) => set(state => ({logs: [...state.logs, msg]})),



    setSimulationRunning: (running: boolean) =>
        set({ isSimulationRunning: running }),

}))
