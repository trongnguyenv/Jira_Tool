using Application.Invites;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [AllowAnonymous]
    public class InvitesController : BaseApiController
    {
        [HttpPost]
        public async Task<IActionResult> CreateInvite(Invitation invite)
        {
            return Ok(await Mediator.Send(new Create.Command { Invite = invite }));
        }

        [HttpGet]
        public async Task<IActionResult> GetInvites()
        {
            return HandleResult(await Mediator.Send(new List.Query()));
        }

        [HttpGet("accept/{id}")]
        public async Task<IActionResult> Accept(string id)
        {
            return HandleResult(await Mediator.Send(new Accept.Query { invite_id = id }));
        }

        [HttpGet("decline/{id}")]
        public async Task<IActionResult> Decline(string id)
        {
            return HandleResult(await Mediator.Send(new Decline.Query { invite_id = id }));
        }
    }
}
