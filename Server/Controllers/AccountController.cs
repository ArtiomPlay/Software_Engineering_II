using Microsoft.AspNetCore.Mvc;
using SE_II.Server.DTOs;
using SE_II.Server.Exceptions;
using SE_II.Server.Interfaces;
using SE_II.Server.Models;

namespace SE_II.Server.Controllers{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase{
        private readonly ILogger<AccountController> _logger;
        private readonly IValidator<Account> _accountValidator;
        private readonly IAccountRepository _accountRepository;

        public AccountController(ILogger<AccountController> logger,IValidator<Account> validator,IAccountRepository accountRepository){
            _logger=logger;
            _accountValidator=validator;
            _accountRepository=accountRepository;
        }

        [HttpPost("register")]
        public async Task<IActionResult> AddAccount([FromBody] AccountDTO newAccount){
            if(newAccount==null)
                return BadRequest("Account details cannot be empty");

            try{
                _accountValidator.Validate(new Account(newAccount.Username,newAccount.Password));
            }catch(InvalidCredentialsException ex){
                _logger.LogWarning(ex,"Invalid credentials for new account with username: {Username}",newAccount.Username);
                return BadRequest(ex.Message);
            }

            var exists=true;

            try{
                var existingAccount=await _accountRepository.GetAccountByUsername(newAccount.Username);
            }catch(AccountNotFoundException){
                exists=false;
            }catch(Exception ex){
                _logger.LogWarning(ex,"Error occurred while checking if account exists with username: {Username}",newAccount.Username);
                return BadRequest("An error occurred while processing your request");
            }

            if(exists){
                _logger.LogWarning("Account with username: {Username} already exists",newAccount.Username);
                return BadRequest("Account with the same username already exists");
            }

            try{
                await _accountRepository.AddAccount(newAccount);
                return Ok();
            }catch(Exception ex){
                _logger.LogWarning(ex,"Error occurred while adding account");
                return BadRequest("An error occurred while processing your request");
            }
        }
    }
}