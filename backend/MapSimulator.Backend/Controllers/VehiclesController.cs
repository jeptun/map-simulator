using MapSimulator.Backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace MapSimulator.Backend.Controllers;

[ApiController]
[Route("vehicles")]
public class VehiclesController : ControllerBase
{
    private static readonly List<Vehicle> Vehicles = new()
    {
        // Evropské tanky
        new Vehicle
        {
            VehicleId = "Leopard2A7",
            Name = "Leopard 2A7",
            Type = "heavy",
            Origin = "Europe",
            Icon = "leopard2a7.png",
            Color = "#007bff",
            Description = "Německý hlavní bojový tank s vysokou přesností a moderní ochranou."
        },
        new Vehicle
        {
            VehicleId = "Leclerc",
            Name = "Leclerc",
            Type = "heavy",
            Origin = "Europe",
            Icon = "leclerc.png",
            Color = "#007bff",
            Description = "Francouzský tank s automatickým nabíjením a nízkou váhou."
        },


        // Ruské tanky
        new Vehicle
        {
            VehicleId = "T90M",
            Name = "T-90M",
            Type = "heavy",
            Origin = "Russia",
            Icon = "t90m.png",
            Color = "#dc3545",
            Description = "Modernizovaná verze ruského tanku s reaktivním pancéřováním a aktivní ochranou."
        },
        new Vehicle
        {
            VehicleId = "T80U",
            Name = "T-80U",
            Type = "heavy",
            Origin = "Russia",
            Icon = "t80u.png",
            Color = "#dc3545",
            Description = "Rychlý tank s plynovou turbínou a dobrými terénními schopnostmi."
        },


        // Evropská vozidla
        new Vehicle
        {
            VehicleId = "Boxer",
            Name = "Boxer IFV",
            Type = "light",
            Origin = "Europe",
            Icon = "boxer.png",
            Color = "#28a745",
            Description = "Modulární obrněné vozidlo s variabilní výzbrojí."
        },


        // Ruská vozidla
        new Vehicle
        {
            VehicleId = "BTR82A",
            Name = "BTR-82A",
            Type = "light",
            Origin = "Russia",
            Icon = "btr82a.png",
            Color = "#dc3545",
            Description = "Pancéřovaný transportér s 30mm kanónem."
        },


        // Evropské drony
        new Vehicle
        {
            VehicleId = "MQ9",
            Name = "MQ-9 Reaper",
            Type = "air",
            Origin = "Europe",
            Icon = "mq9.png",
            Color = "#0dcaf0",
            Description = "Ozbrojený průzkumný a útočný dron dlouhého doletu."
        },

        // Ruské drony
        new Vehicle
        {
            VehicleId = "Orlan10",
            Name = "Orlan-10",
            Type = "air",
            Origin = "Russia",
            Icon = "orlan10.png",
            Color = "#dc3545",
            Description = "Lehký průzkumný dron s dlouhou výdrží."
        },
    };

    [HttpGet]
    public ActionResult<IEnumerable<Vehicle>> GetAll()
    {
        return Ok(Vehicles);
    }
}
