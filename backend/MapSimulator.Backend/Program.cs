using MapSimulator.Backend.Hubs;
using MapSimulator.Backend.Services;

var builder = WebApplication.CreateBuilder(args);

// Služby
builder.Services.AddControllers();
builder.Services.AddSignalR(); // ✅ SignalR
builder.Services.AddHostedService<EntitySimulationService>(); // ✅ Simulátor

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.UseAuthorization();

app.MapControllers();
app.MapHub<EntityHub>("/entityHub"); // ✅ WebSocket endpoint

app.Run();