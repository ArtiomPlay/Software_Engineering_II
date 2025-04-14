using SE_II.Server.DTOs;

namespace SE_II.Server.Models{
    public class Score{
        public int Id{get;set;}
        public int AccountId{get;set;}

        public int score{get;set;}

        public AccountDTO Account{get;set;}
    }

    public class AimTrainerScore : Score{}
    public class MathGameScore : Score{
        public string difficulty{get;set;}="medium";
    }
    public class SequenceScore : Score{}
    public class SeekerScore : Score{}
    public class TypingScore : Score{}
}