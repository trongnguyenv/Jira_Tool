using Application.Sprints;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [AllowAnonymous]
    public class SprintsController : BaseApiController
    {
        [HttpGet]
        public async Task<IActionResult> GetSprints()
        {
            return HandleResult(await Mediator.Send(new List.Query()));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Sprint>> GetSprint(Guid id)
        {
            return await Mediator.Send(new Details.Query { Id = id });
        }

        [HttpPost]
        public async Task<IActionResult> CreateSprint(Sprint sprint)
        {
            return Ok(await Mediator.Send(new Create.Command { Sprint = sprint }));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> EditSprint(Guid Id, Sprint sprint)
        {
            sprint.Id = Id;
            return Ok(await Mediator.Send(new Edit.Command { Sprint = sprint }));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSprint(Guid Id)
        {
            return Ok(await Mediator.Send(new Delete.Command { Id = Id }));
        }

        [HttpPut("{id}/add_issue_to_sprint")]
        public async Task<IActionResult> AddIssueToSprint(FrontEndSprintIssue sprint_issue)
        {
            return Ok(await Mediator.Send(new AddIssueToSprint.Command
            {
                sprint_id = sprint_issue.sprint_id,
                issue_name = sprint_issue.issue_name,
                issue_id = sprint_issue.issue_id
            }));
        }

        [HttpPut("{id}/remove_issue_from_sprint")]
        public async Task<IActionResult> RemoveIssueFromSprint(FrontEndSprintIssue sprint_issue)
        {
            return Ok(await Mediator.Send(new RemoveIssueFromSprint.Command
            {
                sprint_id = sprint_issue.sprint_id,
                issue_name = sprint_issue.issue_name,
                issue_id = sprint_issue.issue_id
            }));
        }

        [HttpPut("move_issue_to_different_sprint")]
        public async Task<IActionResult> MoveIssueToDifferentSprint(FrontEndSprintIssueUpdated sprint_issue)
        {
            return Ok(await Mediator.Send(new MoveIssueToDifferentSprint.Command
            {
                source_sprint_id = sprint_issue.source_sprint_id,
                destination_sprint_id = sprint_issue.destination_sprint_id,
                issue_name = sprint_issue.issue_name,
                issue_id = sprint_issue.issue_id,
                Issue = sprint_issue.issue
            }));
        }

        [HttpPost("close_sprint")]
        public async Task<IActionResult> CloseSprint(FrontEndProjectSprintAndBacklog project_sprint)
        {
            return Ok(await Mediator.Send(new CloseSprint.Command { sprint_id = project_sprint.sprint_id, project_id = project_sprint.project_id, backlog_id = project_sprint.backlog_id }));
        }
    }
}
