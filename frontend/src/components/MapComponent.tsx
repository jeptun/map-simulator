import {useEffect, useRef} from "react"
import OlMap from "ol/Map"
import View from "ol/View"
import TileLayer from "ol/layer/Tile"
import VectorLayer from "ol/layer/Vector"
import VectorSource from "ol/source/Vector"
import OSM from "ol/source/OSM"
import Feature from "ol/Feature"
import Point from "ol/geom/Point"
import LineString from "ol/geom/LineString"
import {Icon, Stroke, Style} from "ol/style"
import {fromLonLat, toLonLat} from "ol/proj"
import {useEntityStore} from "@/hooks/useEntityStore"
import "ol/ol.css"
import ms from "milsymbol"
import {EntitySchema, IEntity} from "@/types/types"
import type MapBrowserEvent from "ol/MapBrowserEvent"
import {sendStepToBackend} from "@/lib/signalr"

// MILSymbol generátor
function createMilSymbol(entity: IEntity): string {
    const parsed = EntitySchema.safeParse(entity)

    if (!parsed.success) {
        console.warn("❌ Entita neprošla validací při generování MIL symbolu:", parsed.error.format())
        return ""
    }

    const validEntity = parsed.data

    // 🎨 Můžeme barvu odvodit podle týmu nebo stavu
    const fillColor =
        validEntity.team === "Red"
            ? "#ff4d4f"
            : validEntity.team === "Blue"
                ? "#1890ff"
                : "#666666"

    const symbol = new ms.Symbol("SFGPUCI----K", {
        size: 40,
        fillColor,
        additionalInformation: validEntity.id,
    })

    return symbol.toDataURL()
}


// Animace pohybu
function animateMove(
    feature: Feature,
    from: [number, number],
    to: [number, number],
    duration = 1000
) {
    const start = Date.now()

    function step() {
        const elapsed = Date.now() - start
        const t = Math.min(elapsed / duration, 1)

        const current: [number, number] = [
            from[0] + (to[0] - from[0]) * t,
            from[1] + (to[1] - from[1]) * t,
        ]

        const geometry = feature.getGeometry() as Point
        geometry.setCoordinates(current)

        if (t < 1) {
            requestAnimationFrame(step)
        }
    }

    requestAnimationFrame(step)
}

//  Komponenta
function MapComponent() {
    const mapRef = useRef<HTMLDivElement | null>(null)
    const mapInstance = useRef<OlMap | null>(null)
    const vectorSourceRef = useRef(new VectorSource())
    const vectorLayerRef = useRef(new VectorLayer({source: vectorSourceRef.current}))
    const featureMapRef = useRef<Map<string, Feature>>(new Map())
    const {setSelectedEntityId, entities} = useEntityStore()

    // 🔃 LineString layer na trasy
    const pathSource = useRef(new VectorSource())
    const pathLayer = useRef(new VectorLayer({
        source: pathSource.current,
        style: new Style({
            stroke: new Stroke({
                color: "rgba(0,255,0,0.6)",
                width: 2,
            }),
        }),
    }))

    // 🗺️ Inicializace mapy
    useEffect(() => {
        if (!mapRef.current) return

        const map = new OlMap({
            target: mapRef.current,
            layers: [
                new TileLayer({source: new OSM()}),
                vectorLayerRef.current,
                pathLayer.current
            ],
            view: new View({
                center: fromLonLat([16.6, 49.2]),
                zoom: 7,
            }),
        })

        mapInstance.current = map
        return () => map.setTarget(null)
    }, [])

    // 🖱️ Kliknutí na entitu nebo mapu
    useEffect(() => {
        const map = mapInstance.current
        if (!map) return

        const handleClick = async (evt: MapBrowserEvent<UIEvent>) => {
            let selectedId: string | null = null

            map.forEachFeatureAtPixel(evt.pixel, (feature) => {
                const entityId = feature.get("entityId")
                if (entityId) {
                    selectedId = entityId
                }
            })

            if (selectedId) {
                setSelectedEntityId(selectedId)
                return
            }

            const coordinate = evt.coordinate
            const [lon, lat] = toLonLat(coordinate)

            const {
                selectedEntityId,
                entities,
                addLog,
                isSimulationRunning
            } = useEntityStore.getState()

            if (!isSimulationRunning) {
                console.log("⏸️ Simulace je pauznutá – nelze přidávat kroky.")
                return
            }

            const entity = selectedEntityId ? entities[selectedEntityId] : null
            if (!entity) return

            await sendStepToBackend(entity.id, lat, lon)

            addLog(`[${new Date().toLocaleTimeString()}] ${entity.id} move to ${lat.toFixed(1)}, ${lon.toFixed(1)}`)
        }

        map.on("singleclick", handleClick)
        return () => map.un("singleclick", handleClick)
    }, [setSelectedEntityId])

    // 🔁 Vykresli entity (ikony)
    useEffect(() => {
        const source = vectorSourceRef.current
        const featureMap = featureMapRef.current

        Object.values(entities).forEach((entity) => {
            const coords = fromLonLat([entity.longitude, entity.latitude])
            const iconUrl = createMilSymbol(entity)
            const id = entity.id

            let feature = featureMap.get(id)

            if (!feature) {
                feature = new Feature({geometry: new Point(coords)})
                feature.set("entityId", id)

                feature.setStyle(new Style({
                    image: new Icon({
                        src: iconUrl,
                        anchor: [0.5, 0.5],
                        scale: 1,
                    }),
                }))

                source.addFeature(feature)
                featureMap.set(id, feature)
            } else {
                const geometry = feature.getGeometry() as Point
                const [x, y] = geometry.getCoordinates()
                const currentCoords: [number, number] = [x, y]
                const distance = Math.sqrt(
                    Math.pow(currentCoords[0] - coords[0], 2) +
                    Math.pow(currentCoords[1] - coords[1], 2)
                )

                if (distance > 1) {
                    animateMove(feature, currentCoords, coords)
                } else {
                    geometry.setCoordinates(coords)
                }
            }
        })
    }, [entities])

    // 🔁 Vykresli trasy kroků (steps)
    useEffect(() => {
        const pathSrc = pathSource.current
        pathSrc.clear()

        Object.values(entities).forEach((entity) => {
            if (!entity.steps || entity.steps.length === 0) return

            const pathCoords = entity.steps.map(step =>
                fromLonLat([step.longitude, step.latitude])
            )

            // Přidej i startovní bod entity (vizuálně propojí aktuální pozici s trasou)
            pathCoords.unshift(fromLonLat([entity.longitude, entity.latitude]))

            const line = new Feature({
                geometry: new LineString(pathCoords),
            })

            pathSrc.addFeature(line)
        })
    }, [entities])

    return <div ref={mapRef} className="w-full h-full"/>
}

export default MapComponent
