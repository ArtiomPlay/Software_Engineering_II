using SE_II.Server.Data;
using SE_II.Server.Enums;
using SE_II.Server.Models;
using SE_II.Server.DTOs;

namespace SE_II.Tests{
    public class Seeding{
        public static void InitializeTestDB(AppDbContext db){
            db.Database.EnsureDeleted();
            db.Database.EnsureCreated();

            db.Accounts.RemoveRange(db.Accounts);
            db.SaveChanges();

            var accounts=GetAccounts();
            db.Accounts.AddRange(accounts);
            db.SaveChanges();

            var aimTrainerScores=GetAimTrainerScores(accounts);
            var mathGameScores=GetMathGameScores(accounts);
            var sequenceScores=GetSequenceScores(accounts);
            var seekerScores=GetSeekerScores(accounts);
            var typingScores=GetTypingScores(accounts);

            db.AimTrainerScores.AddRange(aimTrainerScores);
            db.MathGameScores.AddRange(mathGameScores);
            db.SequenceScores.AddRange(sequenceScores);
            db.SeekerScores.AddRange(seekerScores);
            db.TypingScores.AddRange(typingScores);
            db.SaveChanges();
        }

        private static List<AccountDTO> GetAccounts(){
            return new List<AccountDTO>(){
                new AccountDTO(){Id=1,Username="Jonh",Password="password123",role=Role.User},
                new AccountDTO(){Id=2,Username="Jane",Password="password456",role=Role.User},
                new AccountDTO(){Id=3,Username="Jake",Password="password789",role=Role.User}
            };
        }

        private static List<AimTrainerScore> GetAimTrainerScores(List<AccountDTO> accounts){
            return new List<AimTrainerScore>(){
                new AimTrainerScore(){Id=1,AccountId=accounts[0].Id,score=100,Account=accounts[0]},
                new AimTrainerScore(){Id=2,AccountId=accounts[2].Id,score=120,Account=accounts[2]},
                new AimTrainerScore(){Id=3,AccountId=accounts[1].Id,score=50,Account=accounts[1]},
                new AimTrainerScore(){Id=4,AccountId=accounts[1].Id,score=140,Account=accounts[1]},
                new AimTrainerScore(){Id=5,AccountId=accounts[0].Id,score=60,Account=accounts[0]},
                new AimTrainerScore(){Id=6,AccountId=accounts[2].Id,score=80,Account=accounts[2]}
            };
        }

        private static List<MathGameScore> GetMathGameScores(List<AccountDTO> accounts){
            return new List<MathGameScore>(){
                new MathGameScore(){Id=1,AccountId=accounts[0].Id,score=100,difficulty="medium",Account=accounts[0]},
                new MathGameScore(){Id=2,AccountId=accounts[2].Id,score=120,difficulty="easy",Account=accounts[2]},
                new MathGameScore(){Id=3,AccountId=accounts[1].Id,score=50,difficulty="medium",Account=accounts[1]},
                new MathGameScore(){Id=4,AccountId=accounts[1].Id,score=140,difficulty="hard",Account=accounts[1]},
                new MathGameScore(){Id=5,AccountId=accounts[0].Id,score=60,difficulty="medium",Account=accounts[0]},
                new MathGameScore(){Id=6,AccountId=accounts[2].Id,score=80,difficulty="easy",Account=accounts[2]}
            };
        }

        private static List<SequenceScore> GetSequenceScores(List<AccountDTO> accounts){
            return new List<SequenceScore>(){
                new SequenceScore(){Id=1,AccountId=accounts[0].Id,score=100,Account=accounts[0]},
                new SequenceScore(){Id=2,AccountId=accounts[2].Id,score=120,Account=accounts[2]},
                new SequenceScore(){Id=3,AccountId=accounts[1].Id,score=50,Account=accounts[1]},
                new SequenceScore(){Id=4,AccountId=accounts[1].Id,score=140,Account=accounts[1]},
                new SequenceScore(){Id=5,AccountId=accounts[0].Id,score=60,Account=accounts[0]},
                new SequenceScore(){Id=6,AccountId=accounts[2].Id,score=80,Account=accounts[2]}
            };
        }

        private static List<SeekerScore> GetSeekerScores(List<AccountDTO> accounts){
            return new List<SeekerScore>(){
                new SeekerScore(){Id=1,AccountId=accounts[0].Id,score=100,Account=accounts[0]},
                new SeekerScore(){Id=2,AccountId=accounts[2].Id,score=120,Account=accounts[2]},
                new SeekerScore(){Id=3,AccountId=accounts[1].Id,score=50,Account=accounts[1]},
                new SeekerScore(){Id=4,AccountId=accounts[1].Id,score=140,Account=accounts[1]},
                new SeekerScore(){Id=5,AccountId=accounts[0].Id,score=60,Account=accounts[0]},
                new SeekerScore(){Id=6,AccountId=accounts[2].Id,score=80,Account=accounts[2]}
            };
        }

        private static List<TypingScore> GetTypingScores(List<AccountDTO> accounts){
            return new List<TypingScore>(){
                new TypingScore(){Id=1,AccountId=accounts[0].Id,score=100,Account=accounts[0]},
                new TypingScore(){Id=2,AccountId=accounts[2].Id,score=120,Account=accounts[2]},
                new TypingScore(){Id=3,AccountId=accounts[1].Id,score=50,Account=accounts[1]},
                new TypingScore(){Id=4,AccountId=accounts[1].Id,score=140,Account=accounts[1]},
                new TypingScore(){Id=5,AccountId=accounts[0].Id,score=60,Account=accounts[0]},
                new TypingScore(){Id=6,AccountId=accounts[2].Id,score=80,Account=accounts[2]}
            };
        }
    }
}