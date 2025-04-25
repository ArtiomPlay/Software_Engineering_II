using System.Threading.Tasks;
using System.Collections.Generic;

namespace SE_II.Server.Interfaces
{
    public interface IScoreRepository
    {
        Task AddScoreAsync(string game, string accountName, int score, string difficulty = "medium");
        Task<List<int>> GetScoresByAccountAsync(string game, string accountName);
        Task<List<int>> GetAllScoresAsync(string game);
        Task<int> GetHighScoreByAccountAsync(string game, string accountName);
    }
}
