using MapSimulator.Backend.Models;
using MapSimulator.Backend.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace MapSimulator.Backend.Services;

public class EntitySimulationService : BackgroundService
{
    private readonly IHubContext<EntityHub> _hubContext;
    private readonly List<(double lat, double lon)> _route = new();

    // Aktuální pozice každé entity na trase
    private readonly Dictionary<string, int> _entityPositions = new();

    // Definice entit: id, typ vozidla, tým, počáteční offset, posun latitude
    private readonly List<(string id, string vehicleId, string team, int offset, double latShift)> _entities = new();

    public EntitySimulationService(IHubContext<EntityHub> hubContext)
    {
        _hubContext = hubContext;

        // 🛣️ Trasa z Brna do Prahy (cca po 1 km)
        var brnoLat = 49.1951;
        var brnoLon = 16.6068;
        var prahaLat = 50.0755;
        var prahaLon = 14.4378;
        var steps = 200;

        for (int i = 0; i <= steps; i++)
        {
            double t = (double)i / steps;
            double lat = brnoLat + (prahaLat - brnoLat) * t;
            double lon = brnoLon + (prahaLon - brnoLon) * t;
            _route.Add((lat, lon));
        }

        // 🔵 Modrý tým (Friend)
        _entities.Add(("vehicle-blue-1", "Tank", "Blue", 0, 0.00));
        _entities.Add(("vehicle-blue-2", "Tank", "Blue", -3, 0.01));   // severněji
        _entities.Add(("vehicle-blue-3", "Car",  "Blue", -6, -0.01));  // jižněji

        // 🔴 Červený tým (Hostile)
        _entities.Add(("vehicle-red-1", "Drone", "Red", -10, 0.02));
        _entities.Add(("vehicle-red-2", "Drone", "Red", -13, -0.02));

        // ⏱️ Inicializace pozic entit podle offsetu
        foreach (var (id, _, _, offset, _) in _entities)
        {
            _entityPositions[id] = Math.Max(0, offset);
        }
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            foreach (var (id, vehicleId, team, _, latShift) in _entities)
            {
                var index = _entityPositions[id];
                var (baseLat, lon) = _route[index];
                var lat = baseLat + latShift;

                // 🔁 Mapování pro milsymbol
                var affiliation = team == "Blue" ? "Friend" : "Hostile";
                var battleDimension = vehicleId == "Drone" ? "Air" : "Ground";
                var functionId = vehicleId switch
                {
                    "Tank" => "UAT",   // obrněná jednotka
                    "Car" => "UCI",    // lehké vozidlo
                    "Drone" => "UAV",  // bezpilotní průzkumník
                    _ => "UCI"
                };

                var entity = new Entity
                {
                    Id = id,
                    VehicleId = vehicleId,
                    Latitude = lat,
                    Longitude = lon,
                    Team = team,
                    Status = "Present",
                    Affiliation = affiliation,
                    BattleDimension = battleDimension,
                    SymbolType = "unit",
                    FunctionId = functionId
                };

                await _hubContext.Clients.All.SendAsync("EntityUpdated", entity, cancellationToken: stoppingToken);

                _entityPositions[id] = (index + 1) % _route.Count;
            }

            await Task.Delay(1000, stoppingToken); // každou sekundu update
        }
    }
}
