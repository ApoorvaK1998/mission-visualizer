using Microsoft.AspNetCore.Mvc;

namespace MissionVisualizer.Api.Controllers;

[ApiController]
[Route("api/data")]
public class DataController : ControllerBase
{
    [HttpGet("mission")]
    public IActionResult GetMission()
    {
        var basePath = AppDomain.CurrentDomain.BaseDirectory;
        var path = Path.Combine(basePath, "wwwroot/data", "mission.geojson");
        return PhysicalFile(path, "application/json");
    }

    [HttpGet("park/{layer}")]
    public IActionResult GetParkLayer(string layer)
    {
        var basePath = AppDomain.CurrentDomain.BaseDirectory;
        var path = Path.Combine(basePath, "wwwroot/data", $"{layer}.geojson");

        if (!System.IO.File.Exists(path))
            return NotFound();

        return PhysicalFile(path, "application/json");
    }
}