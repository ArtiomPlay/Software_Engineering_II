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

        [HttpPost("{game}")]
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
        }

        [HttpGet("{game}/account")]
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
        }

        [HttpGet("{game}/all")]
        public async Task<IActionResult> GetAllScores(string game)
        {
            try
            {
                var scores = await _scoreRepository.GetAllScoresAsync(game);
                return Ok(scores);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
