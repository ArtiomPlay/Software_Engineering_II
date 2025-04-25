using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using SE_II.Server.Data;
using SE_II.Server.Enums;
using SE_II.Server.Models;
using SE_II.Server.DTOs;
using System.Net.Http.Json;
using Microsoft.EntityFrameworkCore;

namespace SE_II.Tests.Controllers{
    public class AccountControllerTests : IClassFixture<CustomWebApplicationFactory<Program>>{
        private readonly HttpClient _client;
        private readonly CustomWebApplicationFactory<Program> _factory;

        public AccountControllerTests(CustomWebApplicationFactory<Program> factory){
            _factory=factory;
            _client=_factory.CreateClient(new WebApplicationFactoryClientOptions{AllowAutoRedirect=false});

            using(var scope=_factory.Services.CreateScope()){
                var scopedServices=scope.ServiceProvider;
                var db=scopedServices.GetRequiredService<AppDbContext>();

                db.Database.EnsureCreated();
                Seeding.InitializeTestDB(db);
            };
        }

        [Fact]
        public async Task AddAccount_ReturnsOk_AddsNewAccountToDb(){
            var newAccount=new AccountDTO{Username="newAccount",Password="password"};

            var response=await _client.PostAsJsonAsync("api/Account/register",newAccount);
            response.EnsureSuccessStatusCode();

            Assert.Equal(System.Net.HttpStatusCode.OK,response.StatusCode);

            using(var scope=_factory.Services.CreateScope()){
                var scopedServices=scope.ServiceProvider;
                var db=scopedServices.GetRequiredService<AppDbContext>();
                var createdAccount=await db.Accounts.FirstOrDefaultAsync(u => u.Username==newAccount.Username);

                Assert.NotNull(createdAccount);
                Assert.Equal(newAccount.Username,createdAccount.Username);
                Assert.Equal(newAccount.Password,createdAccount.Password);
            };
        }

        [Fact]
        public async Task GetAccounts_ReturnsListOfAccountsFromDatabase(){
            var response=await _client.GetAsync("api/Account/get_accounts");
            response.EnsureSuccessStatusCode();
            var accounts=await response.Content.ReadFromJsonAsync<List<AccountDTO>>();

            Assert.Equal(System.Net.HttpStatusCode.OK,response.StatusCode);

            using(var scope=_factory.Services.CreateScope()){
                var scopedServices=scope.ServiceProvider;
                var db=scopedServices.GetRequiredService<AppDbContext>();

                List<AccountDTO> actualAccounts=await db.Accounts.ToListAsync();
                
                Assert.NotNull(accounts);
                Assert.NotEmpty(accounts);
                Assert.NotEmpty(actualAccounts);
                Assert.Equal(actualAccounts.Count,accounts.Count);
                foreach(var account in actualAccounts){
                    Assert.Contains(accounts,actual => 
                        actual.Id==account.Id &&
                        actual.Username==account.Username &&
                        actual.Password==account.Password &&
                        actual.role==account.role
                    );
                }
            };
        }

        [Fact]
        public async Task GetAccount_ReturnsAccount_WhenCredentialsAreValid(){
            var account=new AccountInfoDTO{Username="Jonh",Password="password123"};

            var response=await _client.PostAsJsonAsync("api/Account/get_account",account);
            response.EnsureSuccessStatusCode();

            Assert.Equal(System.Net.HttpStatusCode.OK,response.StatusCode);

            var result=await response.Content.ReadFromJsonAsync<AccountDTO>();

            Assert.NotNull(result);
            Assert.NotNull(result.Username);
            Assert.NotNull(result.Password);
        }

        [Fact]
        public async Task DeleteAccount_ReturnsNoContent_RemovesAccountFromDatabase(){
            var accountUsername="Jonh";

            using(var scope=_factory.Services.CreateScope()){
                var scopedServices=scope.ServiceProvider;
                var db=scopedServices.GetRequiredService<AppDbContext>();

                var exist=await db.Accounts.FirstOrDefaultAsync(a => a.Username==accountUsername);
                Assert.NotNull(exist);
            };

            var response=await _client.DeleteAsync($"api/Account/delete/{accountUsername}");

            Assert.Equal(System.Net.HttpStatusCode.NoContent,response.StatusCode);

            using(var scope=_factory.Services.CreateScope()){
                var scopedServices=scope.ServiceProvider;
                var db=scopedServices.GetRequiredService<AppDbContext>();

                var deletedAccount=await db.Accounts.FirstOrDefaultAsync(a => a.Username==accountUsername);
                Assert.Null(deletedAccount);
            };
        }
    }
}