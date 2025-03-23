using MapSimulator.Backend.Models;
using MapSimulator.Backend.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace MapSimulator.Backend.Services;

public class EntitySimulationService : BackgroundService
{
    private readonly IHubContext<EntityHub> _hubContext;
    private readonly Random _random = new();

    public EntitySimulationService(IHubContext<EntityHub> hubContext)
    {
        _hubContext = hubContext;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            var entity = new Entity
            {
                Id = "vehicle-1",
                Latitude = 49.0 + _random.NextDouble(), // random lat
                Longitude = 16.0 + _random.NextDouble(), // random lng
                Status = "moving"
            };

            // Poslat všem připojeným klientům
            await _hubContext.Clients.All.SendAsync("EntityUpdated", entity, cancellationToken: stoppingToken);

            await Task.Delay(1000, stoppingToken); // každou sekundu
        }
    }
}