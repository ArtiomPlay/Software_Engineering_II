using System.Threading.Tasks;
using System.Collections.Generic;
using SE_II.Server.DTOs;

namespace SE_II.Server.Interfaces
{
    public interface IScoreRepository
    {
        Task AddScoreAsync(string game, string accountName, int score, string difficulty = "medium");
        Task<AllStatsDTO> GetAllStatsAsync(int limit=10);
        Task<List<int>> GetScoresByAccountAsync(string game, string accountName);
        Task<List<ScoreDTO>> GetAllScoresAsync(string game,int limit=10);
        Task<int> GetHighScoreByAccountAsync(string game, string accountName);
    }
}
