import {useEffect} from 'react'
import {getConnection} from '@/lib/signalr'
import {useEntityStore} from './useEntityStore'
import {HubConnectionState} from '@microsoft/signalr'
import {IEntity} from '@/types/types'

export const useEntityConnection = () => {
    useEffect(() => {
        const connection = getConnection()

        // ✅ Zaregistruj handlery jen jednou
        if (!(connection as any).__handlersRegistered) {
            (connection as any).__handlersRegistered = true

            connection.on('EntityUpdated', (entity: IEntity) => {
                console.log('[SignalR] Přijatá entita:', entity)
                useEntityStore.getState().addOrUpdateEntity(entity)
            })

            connection.on('EntityRemoved', (id: string) => {
                console.log('[SignalR] Odebraná entita:', id)
                useEntityStore.getState().removeEntity(id)
            })
        }

        const tryStartConnection = async () => {
            if (connection.state === HubConnectionState.Disconnected) {
                try {
                    await connection.start()
                    console.log('[SignalR] Připojeno k backendu')
                } catch (error) {
                    console.error('[SignalR] Chyba při připojení:', error)
                }
            } else {
                console.log('[SignalR] Připojení je ve stavu:', connection.state)
            }
        }

        void tryStartConnection()

        return () => {
            if (connection.state === HubConnectionState.Connected) {
                connection.stop().then(() => {
                    console.log('[SignalR] Odpojeno')
                })
            }
        }
    }, [])
}
