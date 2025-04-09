using System.Collections.Concurrent;
using SE_II.Server.Interfaces;
using SE_II.Server.Models;

namespace SE_II.Server.Services{
    public class SessionService : ISessionService{
        private readonly ConcurrentDictionary<string,UserSession> _sessions=new();
        private readonly TimeSpan _sessionTimeout=TimeSpan.FromMinutes(60);

        public string CreateSession(UserSession session){
            var sessionId=Guid.NewGuid().ToString();
            session.LastAccessed=DateTime.UtcNow;
            _sessions[sessionId]=session;
            return sessionId;
        }

        public bool TryGetSession(string sessionId,out UserSession session){
            if(_sessions.TryGetValue(sessionId,out session)){
                if(DateTime.UtcNow-session.LastAccessed>_sessionTimeout){
                    _sessions.TryRemove(sessionId,out _);
                    session=null;
                    return false;
                }

                session.LastAccessed=DateTime.UtcNow;
                return true;
            }

            return false;
        }

        public void RemoveSession(string sessionId){
            _sessions.TryRemove(sessionId,out _);
        }

        public void CleanupExpiredSessions(){
            foreach(var sessionId in _sessions.Keys){
                if(_sessions.TryGetValue(sessionId,out var session)){
                    if(DateTime.UtcNow-session.LastAccessed>_sessionTimeout){
                        _sessions.TryRemove(sessionId,out _);
                    }
                }
            }
        }
    }
}