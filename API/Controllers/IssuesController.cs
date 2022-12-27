using Application.Issues;
using Application.Projects;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [AllowAnonymous]
    public class IssuesController : BaseApiController
    {
        [HttpGet]
        public async Task<IActionResult> GetIssues()
        {
            return HandleResult(await Mediator.Send(new Application.Issues.List.Query()));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetIssue(Guid id)
        {
            return HandleResult(await Mediator.Send(new Application.Issues.Details.Query { Id = id }));
        }

        [HttpPost]
        public async Task<IActionResult> CreateIssue(Issue issue)
        {
            return Ok(await Mediator.Send(new Application.Issues.Create.Command { Issue = issue }));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> EditIssue(Guid Id, Issue issue)
        {
            issue.Id = Id;
            return Ok(await Mediator.Send(new Application.Issues.Edit.Command { Issue = issue }));
        }

        [HttpPost("update_multiple/{project_id}")]
        public async Task<ProjectDto> EditIssues([FromBody] List<Issue> issues, string project_id)
        {
            return await Mediator.Send(new Application.Issues.EditMultiple.Command { Issues = issues, Id = project_id });
        }

        [HttpPost("comment/{issue_id}")]
        public async Task<IActionResult> AddComment([FromBody] Comment comment, string issue_id)
        {
            return Ok(await Mediator.Send(new Application.Issues.AddComment.Command { Comment = comment, Id = issue_id }));
        }

        [HttpDelete("comment/{issue_id}")]
        public async Task<IActionResult> DeleteComment([FromBody] Comment comment, string issue_id)
        {
            return Ok(await Mediator.Send(new Application.Issues.DeleteComment.Command { Comment = comment, Id = issue_id }));
        }

        [HttpPut("{Id}/assign/{assignee_id}")]
        public async Task<IActionResult> AddAssignee(Guid Id, Guid assignee_id)
        {
            return Ok(await Mediator.Send(new AddAssignee.Command
            {
                issue_id = Id,
                assignee_id = assignee_id
            }));
        }

        [HttpPut("add_assignees_to_issue")]
        public async Task<IActionResult> AddAssigneesToIssue(List<FrontendIssueAssignees> issue_assignees)
        {
            return Ok(await Mediator.Send(new AddAssigneesToIssue.Command { issue_assignees = issue_assignees }));
        }

        [HttpPut("add_assignee_to_issue")]
        public async Task<IActionResult> AddAssigneeToIssue(FrontendIssueAssignees issue_assignee)
        {
            return Ok(await Mediator.Send(new AddAssigneeToIssue.Command { issue_assignee = issue_assignee }));
        }

        [HttpPut("remove_assignee_from_issue")]
        public async Task<IActionResult> RemoveAssigneeFromIssue(FrontendIssueAssignees issue_assignee)
        {
            return Ok(await Mediator.Send(new RemoveAssigneeFromIssue.Command { issue_assignee = issue_assignee }));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteIssue(Guid Id)
        {
            return Ok(await Mediator.Send(new Application.Issues.Delete.Command { Id = Id }));
        }
    }
}
