// src/components/EntityIcon.tsx
import {Entity} from '@/hooks/useEntityStore'

type Props = {
    entity: Entity
}

export default function EntityIcon({entity}: Props) {
    return (
        <div className="text-sm text-left p-2 border rounded bg-white shadow">
            <p><strong>{entity.id}</strong></p>
            <p>Lat: {entity.latitude}</p>
            <p>Lng: {entity.longitude}</p>
            <p>Status: {entity.status}</p>
        </div>
    )
}