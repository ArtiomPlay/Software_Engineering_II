using Microsoft.EntityFrameworkCore;
using SE_II.Server.Data;
using SE_II.Server.Interfaces;
using SE_II.Server.Models;

namespace SE_II.Server.Repositories
{
    public class ScoreRepository : IScoreRepository
    {
        private readonly AppDbContext _context;

        public ScoreRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task AddScoreAsync(string game, string accountName, int score, string difficulty = "medium")
        {
            var account = await _context.Accounts.FirstOrDefaultAsync(a => a.Username == accountName);
            if (account == null) throw new ArgumentException("Account not found");

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
                    throw new ArgumentException("Invalid game type");
            }

            await _context.SaveChangesAsync();
        }

        public async Task<List<object>> GetScoresByAccountAsync(string game, string accountName)
        {
            var account = await _context.Accounts.FirstOrDefaultAsync(a => a.Username == accountName);
            if (account == null) throw new ArgumentException("Account not found");

            return game.ToLower() switch
            {
                "aim" => await _context.AimTrainerScores.Where(s => s.AccountId == account.Id).ToListAsync<object>(),
                "math" => await _context.MathGameScores.Where(s => s.AccountId == account.Id).ToListAsync<object>(),
                "seeker" => await _context.SeekerScores.Where(s => s.AccountId == account.Id).ToListAsync<object>(),
                "sequence" => await _context.SequenceScores.Where(s => s.AccountId == account.Id).ToListAsync<object>(),
                "typing" => await _context.TypingScores.Where(s => s.AccountId == account.Id).ToListAsync<object>(),
                _ => throw new ArgumentException("Invalid game type")
            };
        }

        public async Task<List<object>> GetAllScoresAsync(string game)
        {
            return game.ToLower() switch
            {
                "aim" => await _context.AimTrainerScores.ToListAsync<object>(),
                "math" => await _context.MathGameScores.ToListAsync<object>(),
                "seeker" => await _context.SeekerScores.ToListAsync<object>(),
                "sequence" => await _context.SequenceScores.ToListAsync<object>(),
                "typing" => await _context.TypingScores.ToListAsync<object>(),
                _ => throw new ArgumentException("Invalid game type")
            };
        }
    }
}
