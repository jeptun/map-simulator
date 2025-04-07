# 🗺️ Map Simulator

Webová aplikace pro vizualizaci simulovaných vojenských jednotek pohybujících se po mapě v reálném čase. Projekt využívá
technologie jako React, TypeScript, OpenLayers a SignalR (WebSocket) pro interaktivní simulace a vizualizace.

## ✨ Funkce

- ✅ Realtime aktualizace pozic entit přes SignalR
- 🧭 Zobrazení entit na mapě pomocí MIL-STD-2525 symbolů (milsymbol)
- 🔍 Boční panel s výpisem entit a detaily (vozidla, statusy, týmy)
- 🚘 REST API pro seznam typů vozidel
- ⚙️ Simulace pohybu jednotek mezi městy (např. Brno → Praha)
- 💡 Moderní UI s použitím ShadCN UI, Tailwind CSS a React Query

## 🧱 Technologie

### Frontend

- [React 19](https://react.dev)
- [TypeScript](https://www.typescriptlang.org/)
- [OpenLayers](https://openlayers.org/)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [React Query (TanStack)](https://tanstack.com/query)
- [SignalR client](https://learn.microsoft.com/en-us/aspnet/core/signalr/javascript-client)
- [Tailwind CSS](https://tailwindcss.com/)
- [ShadCN UI](https://ui.shadcn.com/)
- [Vite](https://vitejs.dev/)
- [Zod](https://vitejs.dev/)

### Backend

- ASP.NET Core 8
- SignalR (real-time WebSocket)
- REST API (např. `/vehicles`)

## 🗂️ Struktura

```
/backend
  ├── Controllers/
  ├── Hubs/
  ├── Models/
  ├── Services/
  └── Program.cs

/frontend
  ├── assets/
  ├── components/
  ├── hooks/
  ├── layouts/
  ├── lib/
  └── App.tsx
```

## 🚀 Jak spustit

### Backend (.NET 8)

```bash
cd backend
dotnet run
# Aplikace poběží na http://localhost:5133
```

### Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
# Frontend poběží na http://localhost:5173
```

## 🧪 Endpoints

- `GET /vehicles` – seznam všech vozidel (tanků, dronů, atd.)
- WebSocket: `ws://localhost:5133/entityHub` – příjem realtime aktualizací entit

## 📦 Entity model/Schema

```ts
export const EntitySchema = z.object({
    id: z.string(),
    vehicleId: z.string(),
    latitude: z.number(),
    longitude: z.number(),
    status: z.string(),
    team: z.string(),
    steps: z.array(StepSchema).optional(),
})
```

## 🛡️ Vozidla

```ts
export const VehicleSchema = z.object({
    vehicleId: z.string(),
    name: z.string(),
    type: z.string(),
    origin: z.string(),
    image: z.string(),
    icon: z.string(),
    color: z.string(),
    description: z.string(),
})
```

Projekt obsahuje evropská a ruská vozidla různých typů: tanky, transportéry, drony. Každé má vlastní ikonu, barvu a
popis. A jsou definována na straně backendu.

## 📍 Poznámky

- Entita se na mapě zobrazuje pomocí SVG MIL-STD-2525 symbolu (`milsymbol`)
- Backend uchovává pole Steps[]. Po kliknutí na mapu se uloží GeoStep do entity.Steps
- GeoStep do entity.Steps
- Frontend provádí vizuální přesun

## 📌 TODO (plánované funkce)

- [ ] Router
- [ ] Ikonky podle Vehicle.type nebo stavu (Firing = jiný symbol?)
- [ ] Správné zobrazení entit na mapě pomocí symbolů
- [ ] Číslované waypointy u steps
- [ ] DB Persistence
- [ ] Control panel zobrazit i při skrytém sidepanelu přímo na mapě
- [ ] Zvýraznění entit při výběru
- [ ] Ukladat určité data do localStorage (zatím jsou uloženy vehicles, ale nepracuje se s nimi)
- [ ] Cookie-based JWT Authentication?
- [ ] Interakce entit

---

## 💻 Autor

Josef Dosoudil.

[![GitHub](https://img.shields.io/badge/GitHub-1DA1F2?style=for-the-badge&labelColor=555555&logo=github)](https://github.com/jeptun)
