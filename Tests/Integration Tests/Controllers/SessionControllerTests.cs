using Microsoft.AspNetCore.Mvc.Testing;
using SE_II.Server.Models;
using System.Net.Http.Json;

namespace SE_II.Tests.Integration.Controllers{
    public class SessionControllerTests : IClassFixture<CustomWebApplicationFactory<Program>>{
        private readonly HttpClient _client;
        private readonly CustomWebApplicationFactory<Program> _factory;

        public SessionControllerTests(CustomWebApplicationFactory<Program> factory){
            _factory=factory;
            _client=_factory.CreateClient(new WebApplicationFactoryClientOptions{AllowAutoRedirect=false});
        }

        [Fact]
        public async Task CreateSession_ReturnsOk_WithSessionId(){
            var session=new UserSession{Username="Jonh"};

            var response=await _client.PostAsJsonAsync("/api/Session/create",session);
            response.EnsureSuccessStatusCode();

            Assert.Equal(System.Net.HttpStatusCode.OK,response.StatusCode);

            var responseData=await response.Content.ReadFromJsonAsync<Dictionary<string,string>>();

            Assert.NotNull(responseData);
            Assert.True(responseData.ContainsKey("sessionId"));
            Assert.False(string.IsNullOrWhiteSpace(responseData["sessionId"]));

            Assert.True(response.Headers.TryGetValues("Set-Cookie",out var cookies));
            Assert.Contains(cookies,c => c.StartsWith("SessionId="));
        }

        [Fact]
        public async Task GetSession_ReturnsSession_WhenValidSessionExists() {
            var session=new UserSession{Username="Jonh"};
            var createResponse= await _client.PostAsJsonAsync("/api/Session/create",session);
            createResponse.EnsureSuccessStatusCode();

            var createResponseData=await createResponse.Content.ReadFromJsonAsync<Dictionary<string,string>>();
            var sessionId = createResponseData["sessionId"];

            var getResponse = await _client.GetAsync("/api/Session/get");
            getResponse.EnsureSuccessStatusCode();

            Assert.Equal(System.Net.HttpStatusCode.OK,getResponse.StatusCode);

            var sessionData=await getResponse.Content.ReadFromJsonAsync<UserSession>();
            Assert.NotNull(sessionData);
            Assert.Equal("Jonh",sessionData.Username);
        }

        [Fact]
        public async Task GetSession_ReturnsUnauthorized_WhenNoSessionExists(){
            var response=await _client.GetAsync("/api/Session/get");

            Assert.Equal(System.Net.HttpStatusCode.Unauthorized,response.StatusCode);

            var content=await response.Content.ReadAsStringAsync();
            Assert.Contains("Session not found or expired",content);
        }

        [Fact]
        public async Task Logout_RemovesSessionAndCookie() {
            var session=new UserSession{Username="Jonh"};
            var createResponse=await _client.PostAsJsonAsync("/api/Session/create",session);
            createResponse.EnsureSuccessStatusCode();

            var createResponseData=await createResponse.Content.ReadFromJsonAsync<Dictionary<string,string>>();
            var sessionId=createResponseData["sessionId"];

            var logoutResponse=await _client.PostAsync("/api/Session/logout",null);
            logoutResponse.EnsureSuccessStatusCode();

            Assert.Equal(System.Net.HttpStatusCode.OK,logoutResponse.StatusCode);

            var cookieHeader=logoutResponse.Headers.TryGetValues("Set-Cookie",out var cookies);
            Assert.True(cookieHeader);
            Assert.Contains(cookies,c => c.StartsWith("SessionId="));
        }
    }
}