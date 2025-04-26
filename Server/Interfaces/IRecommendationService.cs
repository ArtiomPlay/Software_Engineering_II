using System.Threading.Tasks;

namespace SE_II.Server.Interfaces
{
    public interface IRecommendationService
    {
        Task<string> GetRecommendedGameAsync(string accountName);
    }
}
