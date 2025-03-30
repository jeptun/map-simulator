import {useEffect, useRef} from "react"
import {Map, View} from "ol"
import TileLayer from "ol/layer/Tile"
import VectorLayer from "ol/layer/Vector"
import VectorSource from "ol/source/Vector"
import OSM from "ol/source/OSM"
import Feature from "ol/Feature"
import Point from "ol/geom/Point"
import {Icon, Style} from "ol/style"
import {fromLonLat} from "ol/proj"
import {Entity, useEntityStore} from "@/hooks/useEntityStore"
import "ol/ol.css"
import ms from "milsymbol"

function createMilSymbol(entity: Entity): string {
    const symbol = new ms.Symbol("SFGPUCI----K", {
        size: 40,
        affiliation: entity.affiliation,
        status: entity.status,
        battleDimension: entity.battleDimension,
        symbolType: entity.symbolType,
        functionId: entity.functionId,
        additionalInformation: entity.id,
    })

    return symbol.toDataURL()
}


function MapComponent() {
    const mapRef = useRef<HTMLDivElement | null>(null)
    const mapInstance = useRef<Map | null>(null)
    const vectorSourceRef = useRef(new VectorSource())
    const vectorLayerRef = useRef(new VectorLayer({ source: vectorSourceRef.current }))
    const featureMapRef = useRef<Map<string, Feature>>(new Map())

    const { entities } = useEntityStore()

    // 🗺️ Inicializace mapy
    useEffect(() => {
        const map = new Map({
            target: mapRef.current!,
            layers: [
                new TileLayer({ source: new OSM() }),
                vectorLayerRef.current,
            ],
            view: new View({
                center: fromLonLat([16.6, 49.2]), // Brno
                zoom: 7,
            }),
        })

        mapInstance.current = map
        return () => map.setTarget(null)
    }, [])

    // 🔁 Aktualizace nebo vytvoření feature pro každou entitu
    useEffect(() => {
        const source = vectorSourceRef.current
        const featureMap = featureMapRef.current

        Object.values(entities).forEach((entity) => {
            const coords = fromLonLat([entity.longitude, entity.latitude])
            const iconUrl = createMilSymbol(entity)
            const id = entity.id
            let feature = featureMap.get(id)


            if (!feature) {
                // 🆕 První vytvoření
                feature = new Feature({
                    geometry: new Point(coords),
                })

                feature.setStyle(
                    new Style({
                        image: new Icon({
                            src: iconUrl,
                            anchor: [0.5, 0.5],
                            scale: 1,
                        }),
                    })
                )

                source.addFeature(feature)
                featureMap.set(id, feature)
            } else {
                // 🔄 Aktualizace pozice
                const geometry = feature.getGeometry() as Point
                geometry.setCoordinates(coords)
            }
        })
    }, [entities])

    return <div ref={mapRef} className="w-full h-full" />
}

export default MapComponent
