import {useEffect, useRef} from "react"
import OlMap from "ol/Map"
import View from "ol/View"
import TileLayer from "ol/layer/Tile"
import VectorLayer from "ol/layer/Vector"
import VectorSource from "ol/source/Vector"
import OSM from "ol/source/OSM"
import Feature from "ol/Feature"
import Point from "ol/geom/Point"
import {Icon, Style} from "ol/style"
import {fromLonLat, toLonLat} from "ol/proj"
import {useEntityStore} from "@/hooks/useEntityStore"
import "ol/ol.css"
import ms from "milsymbol"
import {EntitySchema, IEntity} from "@/types/types"
import type MapBrowserEvent from "ol/MapBrowserEvent"

// 🎖️ MILSymbol generátor
function createMilSymbol(entity: IEntity): string {
    const parsed = EntitySchema.safeParse(entity)

    if (!parsed.success) {
        console.warn("❌ Entita neprošla validací při generování MIL symbolu:", parsed.error.format())
        // Vrátíme např. prázdný nebo výchozí symbol
        return ""
    }

    const validEntity = parsed.data

    const symbol = new ms.Symbol("SFGPUCI----K", {
        size: 40,
        // @ts-ignore – milsymbol nemá správné TS definice
        affiliation: validEntity.affiliation,
        status: validEntity.status,
        battleDimension: validEntity.battleDimension,
        symbolType: validEntity.symbolType,
        functionId: validEntity.functionId,
        additionalInformation: validEntity.id,
    })

    return symbol.toDataURL()
}

// Animace pohybu entity pomocí requestAnimationFrame
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

//  Komponenta s mapou a entitami
function MapComponent() {
    const mapRef = useRef<HTMLDivElement | null>(null)
    const mapInstance = useRef<OlMap | null>(null)
    const vectorSourceRef = useRef(new VectorSource())
    const vectorLayerRef = useRef(new VectorLayer({source: vectorSourceRef.current}))
    const featureMapRef = useRef<globalThis.Map<string, Feature>>(new Map())
    const {setSelectedEntityId} = useEntityStore()
    const {entities} = useEntityStore()

    // 🗺️ Inicializace mapy
    useEffect(() => {
        if (!mapRef.current) return

        const map = new OlMap({
            target: mapRef.current,
            layers: [
                new TileLayer({source: new OSM()}),
                vectorLayerRef.current,
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

        const handleClick = (evt: MapBrowserEvent<UIEvent>) => {
            let selectedId: string | null = null

            map.forEachFeatureAtPixel(evt.pixel, (feature) => {
                const entityId = feature.get("entityId")
                if (entityId) {
                    selectedId = entityId
                }
            })

            if (selectedId) {
                // ✅ Kliknuto na entitu
                console.log("✅ Kliknuto na entitu:", selectedId)
                setSelectedEntityId(selectedId)
                return
            }

            // 🧭 Klik mimo – změna pozice entity
            const coordinate = evt.coordinate
            const [lon, lat] = toLonLat(coordinate)

            const {
                selectedEntityId,
                entities,
                addOrUpdateEntity,
                addLog,
                isSimulationRunning
            } = useEntityStore.getState()

            if (!isSimulationRunning) {
                console.log("⏸️ Simulace je pozastavená – nelze přesouvat entity.")
                return
            }

            const entity = selectedEntityId ? entities[selectedEntityId] : null
            if (!entity) return

            const updated = {
                ...entity,
                latitude: lat,
                longitude: lon,
                status: "Moving",
            }

            addOrUpdateEntity(updated)
            addLog(
                `[${new Date().toLocaleTimeString()}] ${entity.id} moved to ${lat.toFixed(4)}, ${lon.toFixed(4)}`
            )
        }

        map.on("singleclick", handleClick)
        return () => map.un("singleclick", handleClick)
    }, [setSelectedEntityId])

    // 🔁 Vykreslení nebo aktualizace všech entit
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

                feature.set("entityId", id)

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
                console.log("🟢 Vytvořena feature:", id)
            } else {
                // 🔄 Aktualizace pozice s animací
                const geometry = feature.getGeometry() as Point
                const [x, y] = geometry.getCoordinates()
                const currentCoords: [number, number] = [x, y]
                const distance = Math.sqrt(
                    Math.pow(currentCoords[0] - coords[0], 2) +
                    Math.pow(currentCoords[1] - coords[1], 2)
                )

                if (distance > 1) {
                    animateMove(feature, currentCoords, coords, 1000)
                } else {
                    geometry.setCoordinates(coords)
                }
            }
        })
    }, [entities])

    return <div ref={mapRef} className="w-full h-full"/>
}

export default MapComponent