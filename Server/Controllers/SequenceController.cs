using Microsoft.AspNetCore.Mvc;
using SE_II.Server.Models;

namespace SE_II.Server.Controllers{
    [ApiController]
    [Route("api/[controller]")]
    public class SequenceController : ControllerBase{
        private readonly Random _random=new Random();

        [HttpGet("get_cell")]
        public ActionResult<List<Coordinate>> GetCell([FromQuery] int level){
            List<Coordinate> sequence=new List<Coordinate>{};

            Console.Write(level);

            while(sequence.Count()!=level){
                sequence.Add(new Coordinate{x=_random.Next()%3,y=_random.Next()%3});
            }

            return Ok(sequence);
        }
    }
}