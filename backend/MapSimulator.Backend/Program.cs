using MapSimulator.Backend.Hubs;
using MapSimulator.Backend.Services;

var builder = WebApplication.CreateBuilder(args);

// ✅ CORS nastavení
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

// ✅ Služby
builder.Services.AddControllers();
builder.Services.AddSignalR();
builder.Services.AddHostedService<EntitySimulationService>(); //Simulátor entit

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.UseCors(); // ✅ Aktivace CORS

app.UseAuthorization();

app.MapControllers();
// app.MapHub<EntityHub>("/entityHub");// ✅ WebSocket endpoint

app.MapHub<EntityHub>("/entityHub")
    .RequireCors(policy => policy
        .WithOrigins("http://localhost:5173")
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials());

app.Run();