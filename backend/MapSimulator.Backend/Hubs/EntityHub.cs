using MapSimulator.Backend.Models;
using MapSimulator.Backend.Services;
using Microsoft.AspNetCore.SignalR;

namespace MapSimulator.Backend.Hubs;

public class EntityHub : Hub
{
    public override Task OnConnectedAsync()
    {
        Console.WriteLine($"✅ Client connected: {Context.ConnectionId}");
        return base.OnConnectedAsync();
    }

    public Task PauseSimulation()
    {
        EntitySimulationService.Instance?.Pause();
        Console.WriteLine("⏸️ Simulation paused.");
        return Task.CompletedTask;
    }

    public Task ResumeSimulation()
    {
        EntitySimulationService.Instance?.Resume();
        Console.WriteLine("▶️ Simulation resumed.");
        return Task.CompletedTask;
    }

    public Task ResetSimulation()
    {
        Console.WriteLine("🔄 Simulation reset requested from client.");
        EntitySimulationService.Instance?.Reset();
        return Task.CompletedTask;
    }

    public Task<List<Entity>> GetAllEntities()
    {
        Console.WriteLine("📦 Sending all entities to client.");
        return Task.FromResult(EntitySimulationService.Entities);
    }
}