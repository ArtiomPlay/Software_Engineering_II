using System.Threading.Tasks;
using System.Collections.Generic;

namespace SE_II.Server.Interfaces
{
    public interface IScoreRepository
    {
        Task AddScoreAsync(string game, string accountName, int score, string difficulty = "medium");
        Task<List<object>> GetScoresByAccountAsync(string game, string accountName);
        Task<List<object>> GetAllScoresAsync(string game);
    }
}
