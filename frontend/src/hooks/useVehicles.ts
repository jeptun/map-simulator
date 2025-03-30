import {useQuery} from "@tanstack/react-query"
import axios from "axios"
import {useLocalStorage} from "@uidotdev/usehooks"

export type Vehicle = {
    id: string
    name: string
    type: string
    icon: string
    color: string
    description: string
}

export function useVehicles() {
    const [cachedVehicles, setCachedVehicles] = useLocalStorage<Vehicle[]>("vehicles", [])

    return useQuery<Vehicle[]>({
        queryKey: ["vehicles"],
        queryFn: async () => {
            const res = await axios.get("http://localhost:5133/vehicles")
            setCachedVehicles(res.data)
            return res.data
        },
        initialData: cachedVehicles,

    })
}
