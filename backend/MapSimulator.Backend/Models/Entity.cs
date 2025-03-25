namespace MapSimulator.Backend.Models;

public class Entity
{
    public string Id { get; set; } = string.Empty;
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public string Status { get; set; } = "idle";
    public string VehicleId { get; set; } = string.Empty;
}