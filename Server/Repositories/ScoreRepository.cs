using Microsoft.EntityFrameworkCore;
using SE_II.Server.Data;
using SE_II.Server.Interfaces;
using SE_II.Server.Models;
using SE_II.Server.DTOs;

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

        public async Task<List<int>> GetScoresByAccountAsync(string game, string accountName)
        {
            var account = await _context.Accounts.FirstOrDefaultAsync(a => a.Username == accountName);
            if (account == null) throw new ArgumentException("Account not found");

            return game.ToLower() switch
            {
                "aim" => await _context.AimTrainerScores
                            .Where(s => s.AccountId == account.Id)
                            .Select(s => s.score)
                            .ToListAsync(),
                "math" => await _context.MathGameScores
                            .Where(s => s.AccountId == account.Id)
                            .Select(s => s.score)
                            .ToListAsync(),
                "seeker" => await _context.SeekerScores
                            .Where(s => s.AccountId == account.Id)
                            .Select(s => s.score)
                            .ToListAsync(),
                "sequence" => await _context.SequenceScores
                            .Where(s => s.AccountId == account.Id)
                            .Select(s => s.score)
                            .ToListAsync(),
                "typing" => await _context.TypingScores
                            .Where(s => s.AccountId == account.Id)
                            .Select(s => s.score)
                            .ToListAsync(),
                _ => throw new ArgumentException("Invalid game type")
            };
        }

        public async Task<List<ScoreDTO>> GetAllScoresAsync(string game,int limit=10)
        {
            return game.ToLower() switch
            {
                "aim" =>
                    await _context.AimTrainerScores
                        .OrderByDescending(s => s.score)
                        .Take(limit)
                        .Select(s => new ScoreDTO{
                            Username=s.Account.Username,
                            score=s.score
                        })
                        .ToListAsync(),
                "math" =>
                    await _context.MathGameScores
                        .OrderByDescending(s => s.score)
                        .Take(limit)
                        .Select(s => new ScoreDTO{
                            Username=s.Account.Username,
                            score=s.score
                        })
                        .ToListAsync(),
                "seeker" =>
                    await _context.SeekerScores
                        .OrderByDescending(s => s.score)
                        .Take(limit)
                        .Select(s => new ScoreDTO{
                            Username=s.Account.Username,
                            score=s.score
                        })
                        .ToListAsync(),
                "sequence" =>
                    await _context.SequenceScores
                        .OrderByDescending(s => s.score)
                        .Take(limit)
                        .Select(s => new ScoreDTO{
                            Username=s.Account.Username,
                            score=s.score
                        })
                        .ToListAsync(),
                "typing" =>
                    await _context.TypingScores
                        .OrderByDescending(s => s.score)
                        .Take(limit)
                        .Select(s => new ScoreDTO{
                            Username=s.Account.Username,
                            score=s.score
                        })
                        .ToListAsync(),
                _ => throw new ArgumentException("Invalid game type")
            };
        }

        public async Task<int> GetHighScoreByAccountAsync(string game, string accountName)
        {
            var account = await _context.Accounts.FirstOrDefaultAsync(a => a.Username == accountName);
            if (account == null) throw new ArgumentException("Account not found");

            return game.ToLower() switch
            {
                "aim" => await _context.AimTrainerScores
                            .Where(s => s.AccountId == account.Id)
                            .MaxAsync(s => (int?)s.score) ?? 0,
                "math" => await _context.MathGameScores
                            .Where(s => s.AccountId == account.Id)
                            .MaxAsync(s => (int?)s.score) ?? 0,
                "seeker" => await _context.SeekerScores
                            .Where(s => s.AccountId == account.Id)
                            .MaxAsync(s => (int?)s.score) ?? 0,
                "sequence" => await _context.SequenceScores
                            .Where(s => s.AccountId == account.Id)
                            .MaxAsync(s => (int?)s.score) ?? 0,
                "typing" => await _context.TypingScores
                            .Where(s => s.AccountId == account.Id)
                            .MaxAsync(s => (int?)s.score) ?? 0,
                _ => throw new ArgumentException("Invalid game type")
            };
        }

    }
}
