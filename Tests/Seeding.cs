using SE_II.Server.Data;
using SE_II.Server.Enums;
using SE_II.Server.Models;
using SE_II.Server.DTOs;

namespace SE_II.Tests{
    public class Seeding{
        public static void InitializeTestDB(AppDbContext db){

        }

        private static List<AccountDTO> GetAccounts(){
            return new List<AccountDTO>(){
                new AccountDTO(){Id=1,Username="Jonh",Password="password123",role=Role.User},
                new AccountDTO(){Id=2,Username="Jane",Password="password456",role=Role.User},
                new AccountDTO(){Id=3,Username="Jake",Password="password789",role=Role.User}
            };
        }


    }
}