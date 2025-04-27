using SE_II.Server.Interfaces;
using System.Linq;
using System.Threading.Tasks;

namespace SE_II.Server.Services
{
    public class RecommendationService : IRecommendationService
    {
        private readonly IScoreRepository _scoreRepository;

        public RecommendationService(IScoreRepository scoreRepository)
        {
            _scoreRepository = scoreRepository;
        }

        public async Task<string> GetRecommendedGameAsync(string accountName)
        {
            var games = new[] { "aim", "math", "seeker", "sequence", "typing" };
            string recommendedGame = string.Empty;
            double worstPerformance = double.MaxValue;

            foreach (var game in games)
            {
                var userScores = await _scoreRepository.GetScoresByAccountAsync(game, accountName);
                if (userScores.Count == 0)
                    continue;

                var allScores = await _scoreRepository.GetAllScoresAsync(game);
                if (allScores.Count == 0)
                    continue;

                double averageScore = allScores.Select(s => s.score).Average();
                double userAverageScore = userScores.Average();

                double performanceRatio = userAverageScore / averageScore;

                if (performanceRatio < worstPerformance)
                {
                    worstPerformance = performanceRatio;
                    recommendedGame = game;
                }

            }
            return recommendedGame;
        }
    }
}
