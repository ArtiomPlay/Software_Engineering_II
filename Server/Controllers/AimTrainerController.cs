using Microsoft.AspNetCore.Mvc;
using SE_II.Server.Models;

namespace SE_II.Server.Controllers{
    [ApiController]
    [Route("api/[controller]")]
    public class AimTrainerController : ControllerBase{
        private readonly Random _random=new Random();

        [HttpPost("get_target")]
        public IActionResult GetTarget([FromBody] Coordinate maxCoordinate){
            if(maxCoordinate.x<=0 || maxCoordinate.y<=0)
                return BadRequest("Invalid dimensions provided");

            Console.Write("Getting target");
            int targetSize=50;

            int x=_random.Next(0,maxCoordinate.x-targetSize);
            int y=_random.Next(0,maxCoordinate.y-targetSize);

            return Ok(new Coordinate{x=x,y=y});
        }
    }
}