using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using SE_II.Server;
using SE_II.Server.Data;
using SE_II.Server.DTOs;
using SE_II.Server.Models;
using Xunit;

namespace SE_II.Tests.Integration.Controllers{
    public class ScoreControllerTests : IClassFixture<CustomWebApplicationFactory<Program>>{
        private readonly HttpClient _client;

        public ScoreControllerTests(CustomWebApplicationFactory<Program> factory){
            _client=factory.CreateClient();
            
            using var scope=factory.Services.CreateScope();
            var db=scope.ServiceProvider.GetRequiredService<AppDbContext>();
            Seeding.InitializeTestDB(db);
        }

        [Fact]
        public async Task AddScore_ReturnsOk(){
            string game="aim";
            string accountName="Jonh";
            int score=200;

            var response=await _client.PostAsync($"/api/score/{game}/add_score?accountName={accountName}&score={score}",null);

            Assert.Equal(System.Net.HttpStatusCode.OK,response.StatusCode);
            var message=await response.Content.ReadAsStringAsync();
            Assert.Equal("Score added successfully",message);
        }

        [Fact]
        public async Task GetAllStats_ReturnsOk(){
            var response=await _client.GetAsync("/api/score/get_all_stats?limit=5");

            Assert.Equal(System.Net.HttpStatusCode.OK,response.StatusCode);
            var stats=await response.Content.ReadFromJsonAsync<AllStatsDTO>();
            Assert.NotNull(stats);
            Assert.True(stats.totalScore>0);
        }

        [Fact]
        public async Task GetAccountScores_ReturnsOk(){
            string game="typing";
            string accountName="Jonh";

            var response=await _client.GetAsync($"/api/score/{game}/get_account_scores?accountName={accountName}");

            Assert.Equal(System.Net.HttpStatusCode.OK,response.StatusCode);
            var scores=await response.Content.ReadFromJsonAsync<List<int>>();
            Assert.NotNull(scores);
            Assert.True(scores.Count>0);
        }

        [Fact]
        public async Task GetAllScores_ReturnsOk(){
            string game="sequence";

            var response=await _client.GetAsync($"/api/score/{game}/get_all_scores?limit=3");

            Assert.Equal(System.Net.HttpStatusCode.OK,response.StatusCode);
            var scores=await response.Content.ReadFromJsonAsync<List<ScoreDTO>>();
            Assert.NotNull(scores);
            Assert.True(scores.Count<=3);
        }

        [Fact]
        public async Task GetHighscore_ReturnsOk(){
            string game="seeker";
            string accountName="Jonh";

            var response=await _client.GetAsync($"/api/score/{game}/get_highscore?accountName={accountName}");

            Assert.Equal(System.Net.HttpStatusCode.OK,response.StatusCode);
            var score=await response.Content.ReadFromJsonAsync<int>();
            Assert.Equal(100,score);
        }
    }
}
