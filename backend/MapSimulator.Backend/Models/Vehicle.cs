namespace MapSimulator.Backend.Models;

public class Vehicle
{
    public string VehicleId { get; set; } = default!;
    public string Name { get; set; } = default!;
    public string Type { get; set; } = default!;
    public string Origin { get; set; } = default!;
    public string Icon { get; set; } = default!;
    public string Color { get; set; } = default!;
    public string Description { get; set; } = default!;
}