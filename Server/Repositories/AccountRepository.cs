using Microsoft.EntityFrameworkCore;
using SE_II.Server.Data;
using SE_II.Server.DTOs;
using SE_II.Server.Exceptions;
using SE_II.Server.Interfaces;

namespace SE_II.Server.Repositories{
    public class AccountRepository:IAccountRepository{
        private readonly AppDbContext _context;

        public AccountRepository(AppDbContext context){
            _context=context;
        }

        public async Task AddAccount(AccountDTO account){
            await _context.Accounts.AddAsync(account);
            await _context.SaveChangesAsync();
        }

        public async Task<List<AccountDTO>> GetAllAccounts(){
            return await _context.Accounts.ToListAsync();
        }

        public async Task<AccountDTO> GetAccountByUsername(string username){
            var account=await _context.Accounts.FirstOrDefaultAsync(a => a.Username==username);
            if(account==null){
                throw new AccountNotFoundException("Account not found with username: "+username);
            }
            return account;
        }

        public async Task DeleteAccount(string username){
            var account=await _context.Accounts.FirstOrDefaultAsync(a => a.Username==username);
            if(account==null)
                throw new AccountNotFoundException("Account not found with username: "+username);

            _context.Accounts.Remove(account);
            await _context.SaveChangesAsync();
        }
    }
}