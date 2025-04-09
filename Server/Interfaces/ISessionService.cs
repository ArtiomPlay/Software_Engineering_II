using SE_II.Server.Models;

namespace SE_II.Server.Interfaces{
    public interface ISessionService{
        string CreateSession(UserSession session);
        bool TryGetSession(string sessionId,out UserSession session);
        void RemoveSession(string sessionId);
        void CleanupExpiredSessions();
    }
}