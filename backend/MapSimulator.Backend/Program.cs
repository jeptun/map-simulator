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
builder.Services.AddSwaggerGen(options =>
{
    var xmlFile = $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    options.IncludeXmlComments(xmlPath);
});

var app = builder.Build();

app.UseSwagger();

app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "MapSimulator API v1");
    c.RoutePrefix = "swagger"; // URL bude http://localhost:5133/swagger
});


app.UseReDoc(c =>
{
    c.SpecUrl("/swagger/v1/swagger.json");
    c.RoutePrefix = "redoc"; // URL bude http://localhost:5133/redoc
    c.DocumentTitle = "MapSimulator – ReDoc";
});

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