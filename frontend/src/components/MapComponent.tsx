import  { useEffect, useRef } from "react"
import { Map, View } from "ol"
import TileLayer from "ol/layer/Tile"
import VectorLayer from "ol/layer/Vector"
import VectorSource from "ol/source/Vector"
import OSM from "ol/source/OSM"
import Feature from "ol/Feature"
import Point from "ol/geom/Point"
import { Icon, Style } from "ol/style"
import { fromLonLat } from "ol/proj"
import { useEntityStore } from "@/hooks/useEntityStore"
import "ol/ol.css"

function MapComponent() {
    const mapRef = useRef<HTMLDivElement | null>(null)
    const mapInstance = useRef<Map | null>(null)
    const vectorSourceRef = useRef(new VectorSource())
    const vectorLayerRef = useRef(new VectorLayer({ source: vectorSourceRef.current }))
    const featureRef = useRef<Feature | null>(null) // jen jedna entita

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

    //  Posun entity bez přibližování mapy
    useEffect(() => {
        const source = vectorSourceRef.current

        const entity = entities["vehicle-1"]
        if (!entity) return

        const coords = fromLonLat([entity.longitude, entity.latitude])
        const iconPath = `/icons/${entity.vehicleId.toLowerCase()}.png`

        if (!featureRef.current) {
            // První vytvoření
            const feature = new Feature({
                geometry: new Point(coords),
            })

            feature.setStyle(
                new Style({
                    image: new Icon({
                        src: iconPath,
                        scale: 0.05,
                        anchor: [0.5, 1],
                    }),
                })
            )

            source.addFeature(feature)
            featureRef.current = feature
        } else {
            // Jen posun souřadnic
            const geometry = featureRef.current.getGeometry() as Point
            geometry.setCoordinates(coords)
        }
    }, [entities])

    return <div ref={mapRef} className="w-full h-full" />
}

export default MapComponent
