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
                return BadRequest("Error occurred while checking if account exists");
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
                return BadRequest("Error occurred while adding account");
            }
        }

        [HttpGet("get_accounts")]
        public async Task<ActionResult<List<AccountDTO>>> GetAccounts(){
            try{
                var accounts=await _accountRepository.GetAllAccounts();
                return Ok(accounts);
            }catch(Exception ex){
                _logger.LogError(ex,"Error occured while getting accounts");
                return BadRequest("Error occured while getting accounts");
            }
        }

        [HttpPost("get_account")]
        public async Task<IActionResult> GetAccount([FromBody] AccountInfoDTO accountInfo){
            if(accountInfo==null)
                return BadRequest("Account login details cannot be empty");
            
            try{
                _accountValidator.Validate(new Account(accountInfo.Username,accountInfo.Password));

                var account=await _accountRepository.GetAccountByUsername(accountInfo.Username);
                if(account==null || account.Password!= accountInfo.Password){
                    _logger.LogWarning("Account not found with username: {Username} and password: {Password}",accountInfo.Username,accountInfo.Password);
                    return NotFound("Account not found with username: "+accountInfo.Username);
                }

                return Ok(account);
            }catch(InvalidCredentialsException ex){
                _logger.LogWarning(ex,"Invalid credentials for account with username: {Username}", accountInfo.Username);
                return BadRequest(ex.Message);
            }catch(AccountNotFoundException){
                _logger.LogWarning("Account not found with username: {Username}", accountInfo.Username);
                return NotFound("Account not found with username: "+accountInfo.Username);
            }catch(Exception ex){
                _logger.LogError(ex,"Error occurred while getting account with username: {Username}", accountInfo.Username);
                return BadRequest("Error occured while getting account");
            }
        }

        [HttpDelete("delete/{username}")]
        public async Task<IActionResult> DeleteAccount([FromRoute] string username){
            try{
                await _accountRepository.DeleteAccount(username);
                return NoContent();
            }catch(AccountNotFoundException){
                _logger.LogWarning("Account not found with username: {Username}",username);
                return NotFound("Account not found with username: "+username);
            }catch(Exception ex){
                _logger.LogError(ex,"Error occured while deleting account with username: {Username}",username);
                return BadRequest("Error occured while deleting account");
            }
        }
    }
}