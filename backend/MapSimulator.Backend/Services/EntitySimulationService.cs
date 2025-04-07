using MapSimulator.Backend.Models;
using Microsoft.AspNetCore.SignalR;
using MapSimulator.Backend.Hubs;

namespace MapSimulator.Backend.Services;

public class EntitySimulationService : BackgroundService
{
    private readonly IHubContext<EntityHub> _hubContext;
    private bool _isPaused = true;

    public static EntitySimulationService? Instance { get; private set; }
    public static List<Entity> Entities { get; private set; } = new();

    public EntitySimulationService(IHubContext<EntityHub> hubContext)
    {
        _hubContext = hubContext;
        Instance = this;
        GenerateInitialEntities();
    }

    private void GenerateInitialEntities()
    {
        Entities = new List<Entity>
        {
            new Entity
            {
                Id = "blue-1",
                VehicleId = "Leopard2A7",
                Latitude = 49.2000,
                Longitude = 16.6000,
                Team = "Blue",
                Status = "Idle",
            },
            new Entity
            {
                Id = "red-1",
                VehicleId = "T90M",
                Latitude = 49.2100, // cca 1 km severně
                Longitude = 16.6000,
                Team = "Red",
                Status = "Idle",
            }
        };
    }

    public void Pause()
    {
        _isPaused = true;
    }

    public void Resume()
    {
        _isPaused = false;
    }

    public Task AddStep(string entityId, double lat, double lon)
    {
        var entity = EntitySimulationService.Entities.FirstOrDefault(e => e.Id == entityId);
        if (entity != null)
        {
            entity.Steps.Add(new GeoStep { Latitude = lat, Longitude = lon });
            Console.WriteLine($"📍 Přidán krok pro {entity.Id}: {lat}, {lon}");
        }

        return Task.CompletedTask;
    }


    public void Reset()
    {
        Console.WriteLine("🔁 Resetting simulation...");
        Pause();
        GenerateInitialEntities();

        foreach (var entity in Entities)
        {
            _hubContext.Clients.All.SendAsync("EntityUpdated", entity);
        }
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            if (_isPaused)
            {
                await Task.Delay(500, stoppingToken);
                continue;
            }

            foreach (var entity in Entities)
            {
                if (entity.Steps.Count > 0)
                {
                    var step = entity.Steps[0];

                    var dx = step.Longitude - entity.Longitude;
                    var dy = step.Latitude - entity.Latitude;
                    var distance = Math.Sqrt(dx * dx + dy * dy);

                    if (distance < 0.0003) // přibližně 30–40m
                    {
                        entity.Longitude = step.Longitude;
                        entity.Latitude = step.Latitude;
                        entity.Steps.RemoveAt(0);
                        entity.Status = "Idle";

                        Console.WriteLine($"✅ {entity.Id} dorazil na krok {step.Latitude},{step.Longitude}");
                    }
                    else
                    {
                        // Posun mezi body
                        entity.Longitude += dx * 0.2;
                        entity.Latitude += dy * 0.2;
                        entity.Status = "Moving";
                    }

                    // 📡 Odeslat aktualizaci klientům
                    await _hubContext.Clients.All.SendAsync("EntityUpdated", entity, cancellationToken: stoppingToken);
                }
            }

            await Task.Delay(1000, stoppingToken);
        }
    }

}
