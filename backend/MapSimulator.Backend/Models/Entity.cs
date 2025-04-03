namespace MapSimulator.Backend.Models;

public class Entity
{
    public string Id { get; set; } = string.Empty;
    public string VehicleId { get; set; } = string.Empty;

    public double Latitude { get; set; }
    public double Longitude { get; set; }

    public string Team { get; set; } = "Red"; // "Red" | "Blue"
    public string Status { get; set; } = "Idle"; // "Moving" | "Idle" | "Firing" | "Destroyed"
    public List<GeoStep> Steps { get; set; } = new();


    //Def for milsymbol
    public string Affiliation { get; set; } = "Hostile"; // "Hostile" | "Friend"
    public string BattleDimension { get; set; } = "Ground"; // "Ground" | "Air" | "Sea"
    public string SymbolType { get; set; } = "unit"; // default "unit"
    public string FunctionId { get; set; } = "UCI"; // Military function ID (např. obrněná jednotka)


}