using Microsoft.AspNetCore.Mvc;
using SE_II.Server.Interfaces;
using SE_II.Server.Models;

namespace SE_II.Server.Controllers{
    [ApiController]
    [Route("api/[controller]")]
    public class SessionController : ControllerBase{
        private readonly ISessionService _sessionService;

        public SessionController(ISessionService sessionService){
            _sessionService=sessionService;
        }
        
        [HttpPost("create")]
        public IActionResult CreateSession([FromBody] UserSession session){
            var sessionId=_sessionService.CreateSession(session);

            Response.Cookies.Append("SessionId",sessionId,new CookieOptions{
                HttpOnly=true,
                Secure=false,
                Expires=DateTime.Now.AddMinutes(30)
            });
            
            return Ok(new{SessionId=sessionId});
        }

        [HttpGet("get")]
        public IActionResult GetSession(){
            if(Request.Cookies.TryGetValue("SessionId",out var sessionId) && _sessionService.TryGetSession(sessionId,out var session)){
                return Ok(session);
            }

            return Unauthorized("Session not found or expired");
        }

        [HttpPost("logout")]
        public IActionResult Logout(){
            if(Request.Cookies.TryGetValue("SessionId",out var sessionId)){
                _sessionService.RemoveSession(sessionId);
                Response.Cookies.Delete("SessionId");
            }

            return Ok("Logged out");
        }
    }
}