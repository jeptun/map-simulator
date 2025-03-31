import {useQuery} from "@tanstack/react-query"
import axios from "axios"
import {useLocalStorage} from "@uidotdev/usehooks"
import {IVehicle} from "@/types/types.ts";

export function useVehicles() {
    const [cachedVehicles, setCachedVehicles] = useLocalStorage<IVehicle[]>("vehicles", [])

    return useQuery<IVehicle[]>({
        queryKey: ["vehicles"],
        queryFn: async () => {
            const res = await axios.get("http://localhost:5133/vehicles")
            setCachedVehicles(res.data)
            return res.data
        },
        initialData: cachedVehicles,

    })
}
