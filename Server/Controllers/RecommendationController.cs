using Microsoft.AspNetCore.Mvc;
using SE_II.Server.Interfaces;


namespace SE_II.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RecommendationController : ControllerBase
    {
        private readonly IRecommendationService _recommendationService;

        public RecommendationController(IRecommendationService recommendationService)
        {
            _recommendationService = recommendationService;
        }

        [HttpGet("GetRecommendation/{accountName}")]
        public async Task<IActionResult> GetRecommendation(string accountName)
        {
            if (string.IsNullOrEmpty(accountName))
            {
                return BadRequest("Account name must be provided.");
            }

            try
            {
                var recommendedGame = await _recommendationService.GetRecommendedGameAsync(accountName);

                if (string.IsNullOrEmpty(recommendedGame))
                {
                    return NotFound("No recommendation available, you have to play games to get recommendations.");
                }

                return Ok(recommendedGame);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception)
            {
                return StatusCode(500, "An unexpected error occurred.");
            }
        }
    }
}
