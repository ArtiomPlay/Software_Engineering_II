using SE_II.Server.DTOs;

namespace SE_II.Server.Interfaces{
    public interface IAccountRepository{
        Task AddAccount(AccountDTO account);
        Task<List<AccountDTO>> GetAllAccounts();
        Task<AccountDTO> GetAccountByUsername(string username);
        Task DeleteAccount(string username);
    }
}