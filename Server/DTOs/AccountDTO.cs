using SE_II.Server.Enums;
using SE_II.Server.Models;

namespace SE_II.Server.DTOs{
    public class AccountDTO{
        public int Id{get;set;}

        public string Username{get;set;}="";
        public string Password{get;set;}="";
        public Role role{get;set;}=Role.User;

        public List<AimTrainerScore> AimTrainerScores{get;set;}=new List<AimTrainerScore>();
        public List<MathGameScore> MathGameScores{get;set;}=new List<MathGameScore>();
        public List<SeekerScore> SeekerScores{get;set;}=new List<SeekerScore>();
        public List<SequenceScore> SequenceScores{get;set;}=new List<SequenceScore>();
        public List<TypingScore> TypingScores{get;set;}=new List<TypingScore>();
    }
}