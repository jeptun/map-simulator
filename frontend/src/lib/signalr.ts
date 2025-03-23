// src/lib/signalr.ts
import {HubConnection, HubConnectionBuilder, LogLevel} from '@microsoft/signalr'

let connection: HubConnection | null = null

export function createConnection(): HubConnection {
    if (connection) return connection

    // Důležité: nastavení připojení
    connection = new HubConnectionBuilder()
        .withUrl(`${import.meta.env.VITE_BACKEND_URL}/entityHub`)
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Information)
        .build()

    return connection
}
