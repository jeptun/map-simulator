import {HubConnection, HubConnectionBuilder} from '@microsoft/signalr'

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


export async function sendStepToBackend(entityId: string, latitude: number, longitude: number) {
    const connection = getConnection()
    try {
        await connection.invoke("AddStep", entityId, latitude, longitude)
        console.log(`Odeslán step pro ${entityId}: ${latitude}, ${longitude}`)
    } catch (error) {
        console.error("Chyba při odesílání kroku na backend:", error)
    }
}
