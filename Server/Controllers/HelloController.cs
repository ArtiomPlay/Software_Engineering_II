using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/hello")]
public class HelloController : ControllerBase {
    [HttpGet]
    public IActionResult GetHello(){
        return Ok(new {message = "Hello from Blazor Backend"});
    }
}