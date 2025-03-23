import { HubConnectionBuilder, HubConnection } from '@microsoft/signalr'

let connection: HubConnection | null = null

export const getConnection = () => {
    if (!connection) {
        connection = new HubConnectionBuilder()
            .withUrl(import.meta.env.VITE_BACKEND_URL + '/entityHub')
            .withAutomaticReconnect()
            .build()
    }
    return connection
}