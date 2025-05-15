using System.Collections.Concurrent;
using SE_II.Server.Models;
using SE_II.Server.Services;

namespace SE_II.Tests.Unit.Services{
    public class SessionServicesTests{
        private readonly SessionService _sessionService;

        public SessionServicesTests(){
            _sessionService=new SessionService();
        }

        [Fact]
        public void CreateSession_ShouldReturnSessionId_AndStoreSession(){
            var session=new UserSession{Username="Jonh"};
            var sessionId=_sessionService.CreateSession(session);

            Assert.False(string.IsNullOrEmpty(sessionId));

            var result=_sessionService.TryGetSession(sessionId,out var retrievedSession);

            Assert.True(result);
            Assert.NotNull(retrievedSession);
            Assert.Equal(session.Username,retrievedSession.Username);
        }

        [Fact]
        public void TryGetSession_ShouldReturnFalse_WhenSessionDoesNotExist(){
            var result=_sessionService.TryGetSession("nonexistentSessionId",out var session);

            Assert.False(result);
            Assert.Null(session);
        }

        [Fact]
        public void TryGetSession_ShouldReturnFalse_AndRemove_WhenSessionExpired(){
            var session=new UserSession{Username="Jonh"};
            var sessionId=_sessionService.CreateSession(session);

            var field=typeof(SessionService)
                .GetField("_sessions",System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance);
            var sessions=(ConcurrentDictionary<string,UserSession>)field.GetValue(_sessionService);
            sessions[sessionId].LastAccessed=DateTime.UtcNow.AddHours(-2);

            var result=_sessionService.TryGetSession(sessionId,out var retrievedSession);

            Assert.False(result);
            Assert.Null(retrievedSession);
        }

        [Fact]
        public void RemoveSession_ShouldRemoveSession(){
            var session=new UserSession{Username="Jonh"};
            var sessionId=_sessionService.CreateSession(session);
            
            var existsBefore=_sessionService.TryGetSession(sessionId,out _);
            Assert.True(existsBefore);

            _sessionService.RemoveSession(sessionId);

            var existsAfter=_sessionService.TryGetSession(sessionId,out _);
            Assert.False(existsAfter);
        }

        [Fact]
        public void CleanupExpiredSessions_ShouldRemoveExpiredSessions(){
            var activeSession=new UserSession{Username="ActiveUser"};
            var expiredSession=new UserSession{Username="ExpiredUser"};

            var activeSessionId=_sessionService.CreateSession(activeSession);
            var expiredSessionId=_sessionService.CreateSession(expiredSession);

            var field=typeof(SessionService)
                .GetField("_sessions",System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance);
            var sessions=(ConcurrentDictionary<string,UserSession>)field.GetValue(_sessionService);
            sessions[expiredSessionId].LastAccessed=DateTime.UtcNow.AddHours(-2);

            _sessionService.CleanupExpiredSessions();

            var activeExists=_sessionService.TryGetSession(activeSessionId,out _);
            Assert.True(activeExists);

            var expiredExists=_sessionService.TryGetSession(expiredSessionId,out _);
            Assert.False(expiredExists);
        }
    }
}
