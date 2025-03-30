using MapSimulator.Backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace MapSimulator.Backend.Controllers;

[ApiController]
[Route("vehicles")]
public class VehiclesController : ControllerBase
{
    private static readonly List<Vehicle> Vehicles = new()
    {
        new Vehicle
        {
            Id = "Car",
            Name = "Obrněné auto",
            Type = "light",
            Icon = "car.jpg",
            Color = "#007bff",
            Description = "Rychlé a lehce pancéřované vozidlo"
        },
        new Vehicle
        {
            Id = "Tank",
            Name = "Hlavní bojový tank",
            Type = "heavy",
            Icon = "tank.png",
            Color = "#dc3545",
            Description = "Těžce obrněná jednotka"
        },
        new Vehicle
        {
            Id = "Drone",
            Name = "Průzkumný dron",
            Type = "air",
            Icon = "drone.png",
            Color = "#28a745",
            Description = "Lehký bezpilotní průzkumník"
        }
    };

    [HttpGet]
    public ActionResult<IEnumerable<Vehicle>> GetAll()
    {
        return Ok(Vehicles);
    }
}