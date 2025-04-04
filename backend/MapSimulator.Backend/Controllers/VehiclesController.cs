using MapSimulator.Backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace MapSimulator.Backend.Controllers;

/// <summary>
/// Spravuje dostupná vojenská vozidla použitelná v simulaci.
/// </summary>
[ApiController]
[Route("vehicles")]
[Produces("application/json")]
public class VehiclesController : ControllerBase
{
    /// <summary>
    /// Vrací seznam všech vojenských vozidel.
    /// </summary>
    /// <remarks>
    /// Tento endpoint vrací všechna vozidla (tank, dron, vozidlo), která lze použít v simulaci.
    /// Každé vozidlo obsahuje popis, typ, původ a barvu.
    /// </remarks>
    /// <response code="200">Vrací úspěšně seznam vozidel</response>
    /// <response code="500">Interní chyba serveru</response>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<Vehicle>))]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public ActionResult<IEnumerable<Vehicle>> GetAll()
    {
        return Ok(Vehicles);
    }



    /// <summary>
    /// Vrací detail jednoho konkrétního vozidla.
    /// </summary>
    /// <param name="id">Identifikátor vozidla (např. T90M)</param>
    /// <response code="200">Vrací nalezené vozidlo</response>
    /// <response code="400">Neplatný formát identifikátoru</response>
    /// <response code="404">Pokud vozidlo nebylo nalezeno</response>
    /// <response code="500">Interní chyba serveru</response>
    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(Vehicle))]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public ActionResult<Vehicle> GetById(string id)
    {
        if (string.IsNullOrWhiteSpace(id))
            return BadRequest("ID nesmí být prázdné.");

        var vehicle = Vehicles.FirstOrDefault(v => v.VehicleId.Equals(id, StringComparison.OrdinalIgnoreCase));

        if (vehicle is null)
            return NotFound($"Vozidlo s ID '{id}' nebylo nalezeno.");

        return Ok(vehicle);
    }


    /// <summary>
    /// Vrací všechna vozidla daného typu.
    /// </summary>
    /// <remarks>
    /// Např. všechny drony nebo všechny těžké tanky.
    /// </remarks>
    /// <param name="type">Typ vozidla (heavy, light, air)</param>
    /// <response code="200">Seznam nalezených vozidel</response>
    /// <response code="400">Typ není specifikován</response>
    /// <response code="404">Žádné vozidlo daného typu nebylo nalezeno</response>
    /// <response code="500">Interní chyba serveru</response>
    [HttpGet("type/{type}")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<Vehicle>))]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public ActionResult<IEnumerable<Vehicle>> GetAllByType(string type)
    {
        if (string.IsNullOrWhiteSpace(type))
            return BadRequest("Typ vozidla nesmí být prázdný.");

        var result = Vehicles
            .Where(v => v.Type.Equals(type, StringComparison.OrdinalIgnoreCase))
            .ToList();

        if (result.Count == 0)
            return NotFound($"Žádné vozidlo typu '{type}' nebylo nalezeno.");

        return Ok(result);
    }



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


}
