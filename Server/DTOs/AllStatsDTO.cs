namespace SE_II.Server.DTOs{
    public class AllStatsDTO{
        public int totalScore{get;set;}
        public int totalTimesPlayed{get;set;}
        public string highscoreGame{get;set;}
        public int highscoreScore{get;set;}
        public List<ScoreDTO> leaderboard{get;set;}
    }
}