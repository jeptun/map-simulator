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
                Affiliation = "Friend",
                BattleDimension = "Ground",
                SymbolType = "unit",
                FunctionId = "UCI"
            },
            new Entity
            {
                Id = "red-1",
                VehicleId = "T90M",
                Latitude = 49.2100, // cca 1 km severně
                Longitude = 16.6000,
                Team = "Red",
                Status = "Idle",
                Affiliation = "Hostile",
                BattleDimension = "Ground",
                SymbolType = "unit",
                FunctionId = "UCI"
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
        foreach (var entity in Entities)
        {
            await _hubContext.Clients.All.SendAsync("EntityUpdated", entity, cancellationToken: stoppingToken);
            Console.WriteLine($"📤 Sent entity to clients: {entity.Id}");
        }

        while (!stoppingToken.IsCancellationRequested)
        {
            if (_isPaused)
            {
                await Task.Delay(500, stoppingToken);
                continue;
            }

            await Task.Delay(1000, stoppingToken);
        }
    }
}
