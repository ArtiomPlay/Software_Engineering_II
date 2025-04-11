using Microsoft.AspNetCore.Mvc;

namespace SE_II.Server.Controllers{
    [ApiController]
    [Route("api/[controller]")]
    public class SeekerController : ControllerBase{
        private readonly Random _random=new Random();

        [HttpGet("get_cell")]
        public ActionResult<List<int>> GetCell(){
            List<int> cell=new List<int>{};
            cell.Add(_random.Next()%10);
            cell.Add(_random.Next()%10);
            return Ok(cell);
        }
    }
}