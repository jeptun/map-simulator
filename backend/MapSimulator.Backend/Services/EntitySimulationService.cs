using MapSimulator.Backend.Models;
using MapSimulator.Backend.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace MapSimulator.Backend.Services;

public class EntitySimulationService : BackgroundService
{
    private readonly IHubContext<EntityHub> _hubContext;

    // Trasa z Brna do Prahy jako body po 1 km
    private readonly List<(double lat, double lon)> _route = new();
    private int _currentIndex = 0;

    public EntitySimulationService(IHubContext<EntityHub> hubContext)
    {
        _hubContext = hubContext;


        var brnoLat = 49.1951;
        var brnoLon = 16.6068;
        var prahaLat = 50.0755;
        var prahaLon = 14.4378;

        var steps = 200; // přibližně 1 km krok
        for (int i = 0; i <= steps; i++)
        {
            double t = (double)i / steps;
            double lat = brnoLat + (prahaLat - brnoLat) * t;
            double lon = brnoLon + (prahaLon - brnoLon) * t;
            _route.Add((lat, lon));
        }
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            var (lat, lon) = _route[_currentIndex];

            var entity = new Entity
            {
                Id = "vehicle-1",
                Latitude = lat,
                Longitude = lon,
                Status = "moving",
                VehicleId = "Tank"
            };

            await _hubContext.Clients.All.SendAsync("EntityUpdated", entity, cancellationToken: stoppingToken);

            _currentIndex = (_currentIndex + 1) % _route.Count;

            await Task.Delay(1000, stoppingToken); // každou sekundu další bod
        }
    }
}