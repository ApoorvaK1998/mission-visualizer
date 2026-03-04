using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Logging;

namespace MissionVisualizer.Api.Controllers;

[ApiController]
[Route("api/data")]
public class DataController : ControllerBase
{
    private readonly IWebHostEnvironment _environment;
    private readonly ILogger<DataController> _logger;

    public DataController(IWebHostEnvironment environment, ILogger<DataController> logger)
    {
        _environment = environment;
        _logger = logger;
    }

    [HttpGet("mission")]
    public IActionResult GetMission()
    {
        var path = Path.Combine(_environment.WebRootPath ?? _environment.ContentRootPath, "data", "mission.geojson");
        
        if (!System.IO.File.Exists(path))
        {
            _logger.LogWarning("Mission file not found: {Path}", path);
            return NotFound("Mission data not available");
        }
        
        return PhysicalFile(path, "application/json");
    }

    [HttpGet("park/{layer}")]
    public IActionResult GetParkLayer(string layer)
    {
        if (string.IsNullOrWhiteSpace(layer))
        {
            return BadRequest("Layer parameter is required");
        }
        
        var path = Path.Combine(_environment.WebRootPath ?? _environment.ContentRootPath, "data", $"{layer}.geojson");

        if (!System.IO.File.Exists(path))
        {
            _logger.LogWarning("Park layer file not found: {Path}", path);
            return NotFound($"Layer '{layer}' not found");
        }

        return PhysicalFile(path, "application/json");
    }
}
