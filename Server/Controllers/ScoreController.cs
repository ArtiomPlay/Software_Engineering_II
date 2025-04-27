using Microsoft.AspNetCore.Mvc;
using SE_II.Server.Interfaces;

namespace SE_II.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ScoreController : ControllerBase
    {
        private readonly IScoreRepository _scoreRepository;
        private readonly ILogger<ScoreController> _logger;

        public ScoreController(IScoreRepository scoreRepository, ILogger<ScoreController> logger)
        {
            _scoreRepository = scoreRepository;
            _logger = logger;
        }

        [HttpPost("{game}/add_score")]
        public async Task<IActionResult> AddScore(string game, [FromQuery] string accountName, [FromQuery] int score, [FromQuery] string difficulty = "medium")
        {
            try
            {
                await _scoreRepository.AddScoreAsync(game, accountName, score, difficulty);
                _logger.LogInformation($"Score added - Game: {game}, Account: {accountName}, Score: {score}");
                return Ok("Score added successfully");
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

        [HttpGet("get_all_stats")]
        public async Task<IActionResult> GetAllStats([FromQuery]int limit=10){
            try{
                var stats=await _scoreRepository.GetAllStatsAsync(limit);

                return Ok(stats);
            }catch(Exception){
                return StatusCode(500,"An unexpected error occurred.");
            }
        }

        [HttpGet("{game}/get_account_scores")]
        public async Task<IActionResult> GetAccountScores(string game, [FromQuery] string accountName)
        {
            try
            {
                var scores = await _scoreRepository.GetScoresByAccountAsync(game, accountName);
                return Ok(scores);
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

        [HttpGet("{game}/get_all_scores")]
        public async Task<IActionResult> GetAllScores(string game,[FromQuery] int limit=10)
        {
            try
            {
                var scores = await _scoreRepository.GetAllScoresAsync(game,limit);
                return Ok(scores);
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

        [HttpGet("{game}/get_highscore")]
        public async Task<IActionResult> GetAccountHighscore(string game, [FromQuery] string accountName)
        {
            try
            {
                var highscore = await _scoreRepository.GetHighScoreByAccountAsync(game, accountName);
                return Ok(highscore);
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
