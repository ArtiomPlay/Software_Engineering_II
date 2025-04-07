using SE_II.Server.DTOs;

namespace SE_II.Server.Interfaces{
    public interface IAccountRepository{
        Task AddAccount(AccountDTO account);
        Task<AccountDTO> GetAccountByUsername(string username);
    }
}