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
import {fromLonLat} from "ol/proj"
import {useEntityStore} from "@/hooks/useEntityStore"
import "ol/ol.css"
import ms from "milsymbol"
import {IEntity} from "@/types/types.ts";
import type MapBrowserEvent from "ol/MapBrowserEvent"

function createMilSymbol(entity: IEntity): string {

    const symbol = new ms.Symbol("SFGPUCI----K", {
        size: 40,
        // @ts-ignore
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
    const mapInstance = useRef<OlMap | null>(null)
    const vectorSourceRef = useRef(new VectorSource())
    const vectorLayerRef = useRef(new VectorLayer({ source: vectorSourceRef.current }))
    const featureMapRef = useRef<globalThis.Map<string, Feature>>(new globalThis.Map())
    const {setSelectedEntityId} = useEntityStore()
    const { entities } = useEntityStore()

    // 🗺️ Inicializace mapy
    useEffect(() => {

        if (!mapRef.current) return

        const map = new OlMap({
            target: mapRef.current as HTMLElement,
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

    useEffect(() => {
        const map = mapInstance.current
        if (!map) return

        const handleClick = (evt: MapBrowserEvent<UIEvent>) => {
            map.forEachFeatureAtPixel(evt.pixel, (feature) => {
                const entityId = feature.get('entityId')
                if (entityId) {
                    console.log('✅ Kliknuto na entitu:', entityId)
                    setSelectedEntityId(entityId)
                }
            })
        }

        map.on('click', handleClick)

        // 🧹 Úklid po odmountování
        return () => {
            map.un('click', handleClick)
        }
    }, [setSelectedEntityId])


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

                feature.set('entityId', id)

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
