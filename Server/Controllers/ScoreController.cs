using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SE_II.Server.Data;
using SE_II.Server.Models;

namespace SE_II.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ScoreController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<ScoreController> _logger;

        public ScoreController(AppDbContext context, ILogger<ScoreController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpPost("{game}")]
        public async Task<IActionResult> AddScoreToAccount(string game, [FromQuery] string accountName, [FromQuery] int score, [FromQuery] string difficulty = "medium")
        {
            var account = await _context.Accounts.FirstOrDefaultAsync(a => a.Username == accountName);
            if (account == null)
            {
                _logger.LogInformation("Not found.");
                return NotFound("Account not found");
            }


            switch (game.ToLower())
            {
                case "aim":
                    _context.AimTrainerScores.Add(new AimTrainerScore { AccountId = account.Id, score = score });
                    break;
                case "math":
                    _context.MathGameScores.Add(new MathGameScore { AccountId = account.Id, score = score, difficulty = difficulty });
                    break;
                case "seeker":
                    _context.SeekerScores.Add(new SeekerScore { AccountId = account.Id, score = score });
                    break;
                case "sequence":
                    _context.SequenceScores.Add(new SequenceScore { AccountId = account.Id, score = score });
                    break;
                case "typing":
                    _context.TypingScores.Add(new TypingScore { AccountId = account.Id, score = score });
                    break;
                default:
                    return BadRequest("Invalid game type");
            }

            await _context.SaveChangesAsync();
            _logger.LogInformation($"Score Received - Game: {game}, Account: {accountName}, Score: {score}");
            return Ok("Score added successfully");
        }
    }
}
