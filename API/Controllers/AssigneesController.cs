using Application.Assignees;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [AllowAnonymous]
    public class AssigneesController : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult<List<Assignee>>> GetAssignees()
        {
            return await Mediator.Send(new List.Query());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Assignee>> GetAssignee(Guid id)
        {
            return await Mediator.Send(new Details.Query { Id = id });
        }

        [HttpGet("app_user/{app_user_id}")]
        public async Task<ActionResult<Assignee>> GetAssigneeByAppUserId(string app_user_id)
        {
            return await Mediator.Send(new FindByAppUser.Query { id = app_user_id });
        }

        [HttpPost]
        public async Task<IActionResult> CreateAssignee(Assignee assignee)
        {
            return Ok(await Mediator.Send(new Create.Command { Assignee = assignee }));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> EditAssignee(Guid Id, Assignee assignee)
        {
            assignee.Id = Id;
            return Ok(await Mediator.Send(new Edit.Command { Assignee = assignee }));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAssignee(Guid Id)
        {
            return Ok(await Mediator.Send(new Delete.Command { Id = Id }));
        }
    }
}
