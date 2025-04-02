import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useLocalStorage } from "@uidotdev/usehooks"
import { VehicleSchema } from "@/types/types" // importuj schéma
import { z } from "zod"
import type { IVehicle } from "@/types/types"


export function useVehicles() {
    const [cachedVehicles, setCachedVehicles] = useLocalStorage<IVehicle[]>("vehicles", [])

    return useQuery<IVehicle[]>({
        queryKey: ["vehicles"],
        queryFn: async () => {
            const res = await axios.get("http://localhost:5133/vehicles")
            const parsed = z.array(VehicleSchema).safeParse(res.data)

            if (!parsed.success) {
                console.error("❌ Nevalidní data z REST /vehicles", parsed.error.format())
                throw new Error("Invalid vehicle data from server.")
            }

            setCachedVehicles(parsed.data)
            return parsed.data
        },
        initialData: cachedVehicles,
    })
}
