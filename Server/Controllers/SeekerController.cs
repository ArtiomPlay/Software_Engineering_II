using Microsoft.AspNetCore.Mvc;
using SE_II.Server.Models;

namespace SE_II.Server.Controllers{
    [ApiController]
    [Route("api/[controller]")]
    public class SeekerController : ControllerBase{
        private readonly Random _random=new Random();

        [HttpGet("get_cell")]
        public ActionResult<Coordinate> GetCell(){
            int x=_random.Next()%10;
            int y=_random.Next()%10;
            return Ok(new Coordinate{x=x,y=y});
        }
    }
}