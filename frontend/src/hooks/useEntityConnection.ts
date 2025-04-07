// useEntityConnection.ts
import {useEffect, useState} from 'react'
import {getConnection} from '@/lib/signalr'
import {useEntityStore} from './useEntityStore'
import {HubConnectionState} from '@microsoft/signalr'
import {EntitySchema, VehicleSchema} from "@/types/types"
import {z} from "zod"
import axios from "axios"

export const useEntityConnection = (): boolean => {
    const { addOrUpdateEntity, removeEntity } = useEntityStore()
    const [isConnected, setIsConnected] = useState(false)

    useEffect(() => {
        const connection = getConnection()

        if (!(connection as any).__handlersRegistered) {
            (connection as any).__handlersRegistered = true

            connection.on('EntityUpdated', (data: unknown) => {
                const parsed = EntitySchema.safeParse(data)
                if (parsed.success) {
                    addOrUpdateEntity(parsed.data)
                } else {
                    console.error("❌ Invalid entity from SignalR:", parsed.error.format())
                }
            })

            connection.on('EntityRemoved', (id: string) => {
                removeEntity(id)
            })
        }

        const tryStartConnection = async () => {
            if (connection.state === HubConnectionState.Disconnected) {
                try {
                    await connection.start()
                    const rawEntities = await connection.invoke<unknown>("GetAllEntities")
                    const parsed = z.array(EntitySchema).safeParse(rawEntities)

                    if (parsed.success) {
                        parsed.data.forEach(addOrUpdateEntity)
                        setIsConnected(true)
                    } else {
                        console.error("❌ Chybný formát entit ze serveru:", parsed.error.format())
                    }
                } catch (error) {
                    console.warn('[SignalR] ❌ Nepřipojeno. Vytvářím fallback entity z REST.')

                    try {
                        const response = await axios.get("http://localhost:5133/vehicles")
                        const vehicleResult = z.array(VehicleSchema).safeParse(response.data)

                        if (!vehicleResult.success) {
                            console.error("❌ Nevalidní data z /vehicles:", vehicleResult.error.format())
                            return
                        }

                        vehicleResult.data.forEach((vehicle, i) => {
                            const fallbackEntity = {
                                id: `fallback-${i}`,
                                vehicleId: vehicle.vehicleId,
                                latitude: 49.2 + i * 0.01,
                                longitude: 16.6,
                                status: "Idle",
                                team: i % 2 === 0 ? "Blue" : "Red",


                            }

                            const parsedEntity = EntitySchema.safeParse(fallbackEntity)
                            if (parsedEntity.success) {
                                addOrUpdateEntity(parsedEntity.data)
                            } else {
                                console.warn("❌ Fallback entita neprošla validací", parsedEntity.error.format())
                            }
                        })
                    } catch (e) {
                        console.error("❌ Chyba při načítání fallback entit z REST:", e)
                    }
                }
            }
        }

        void tryStartConnection()
    }, [addOrUpdateEntity, removeEntity])

    return isConnected
}
