using Application.Core;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Sprints
{
    public class CloseSprint
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string sprint_id { get; set; }

            public string project_id { get; set; }

            public string backlog_id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var project = await _context.Projects
                    .Include(s => s.sprints)
                    .FirstOrDefaultAsync(x => x.Id.ToString().ToLower() == request.project_id.ToString().ToLower());
                if (project == null) Console.WriteLine("Project not found"); Console.WriteLine(request.project_id); if (project == null) return null;

                var sprint_to_close = await _context.Sprints
                    .Include(i => i.issues)
                    .FirstOrDefaultAsync(x => x.Id.ToString().ToLower() == request.sprint_id.ToString().ToLower());
                if (sprint_to_close == null) Console.WriteLine("Sprint not found"); Console.WriteLine(request.sprint_id); if (sprint_to_close == null) return null;

                var backlog_sprint = await _context.Sprints
                    .Include(i => i.issues)
                    .FirstOrDefaultAsync(x => x.Id.ToString().ToLower() == request.backlog_id.ToString().ToLower());
                if (backlog_sprint == null) Console.WriteLine("Backlog sprint not found"); Console.WriteLine(request.backlog_id); if (backlog_sprint == null) return null;

                List<string> issue_ids_in_the_sprint_to_be_closed = new List<string>();
                foreach (var current_issue in sprint_to_close.issues)
                {
                    Console.WriteLine("Current issue =");
                    Console.WriteLine(current_issue.IssueId.ToString().ToLower());
                    Console.WriteLine("Backlog Sprint Id =");
                    Console.WriteLine(backlog_sprint.Id);

                    Console.WriteLine("Sprint to close Id =");
                    Console.WriteLine(sprint_to_close.Id);
                    issue_ids_in_the_sprint_to_be_closed.Add(current_issue.IssueId.ToString().ToLower());
                }

                var all_issues = await _context.Issues.Include(a => a.assignees).ToListAsync();

                var specific_issues_to_remove_from_sprint = all_issues
                    .Where(issue => issue_ids_in_the_sprint_to_be_closed.Contains(issue.Id.ToString().ToLower()));

                foreach (var issue in specific_issues_to_remove_from_sprint)
                {
                    var issue_to_remove = new SprintIssue
                    {
                        Sprint = sprint_to_close,
                        Issue = issue
                    };
                    Console.WriteLine("Issue to remove ID =");
                    Console.WriteLine(issue_to_remove.Issue.Id);
                    Console.WriteLine("Sprint to close ID =");
                    Console.WriteLine(issue_to_remove.Sprint.Id);

                    var currentlyInTheSprint = sprint_to_close.issues
                        .FirstOrDefault(x => x.Issue.Id.ToString().ToLower() == issue.Id.ToString().ToLower());

                    sprint_to_close.issues.Remove(currentlyInTheSprint);
                    Console.WriteLine("Deleting issue");
                    var deleted_issue = await _context.SaveChangesAsync() > 0;
                    backlog_sprint.issues.Add(currentlyInTheSprint);
                    Console.WriteLine("Adding issue");
                    var added_issue = await _context.SaveChangesAsync() > 0;
                }

                //Console.WriteLine("Updating Issues");

                //Console.WriteLine(updated_issues);

                foreach (var sprint in project.sprints)
                {
                    Console.WriteLine("sprint.SprintId inside project:");
                    Console.WriteLine(sprint.SprintId);
                    //Console.WriteLine("sprint.Sprint.Id inside project:");
                    //Console.WriteLine(sprint.Sprint.Id);
                }
                var currentInTheProject = project.sprints.FirstOrDefault(x => x.SprintId.ToString().ToLower() == sprint_to_close.Id.ToString().ToLower());
                if (currentInTheProject == null) Console.WriteLine("Project not found"); if (currentInTheProject == null) return null;
                project.sprints.Remove(currentInTheProject);

                var result = await _context.SaveChangesAsync() > 0;

                return result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Problem removing issue from sprint.");

                /*

                    var sprint = await _context.Sprints
                        .Include(i => i.issues)
                        .FirstOrDefaultAsync(x => x.Id.ToString().ToLower() == request.sprint_id.ToString().ToLower());

                    if (sprint == null) return null;
                    Console.WriteLine("Found Sprint =");
                    Console.WriteLine(sprint.name);

                    var selected_project = await _context.Projects
                        .Include(s => s.sprints)
                        .FirstOrDefaultAsync(x => x.Id.ToString().ToLower() == request.project_id.ToString().ToLower());

                    List<string> issue_ids = new List<string>();
                    foreach(var current_issue in sprint.issues){
                        issue_ids.Add(current_issue.IssueId.ToString().ToLower());
                    }

                    var all_issues = await _context.Issues.Include(a => a.assignees).ToListAsync();

                    var issues_in_sprint = all_issues
                        .Where(issue => issue_ids.Contains(issue.Id.ToString().ToLower()));

                    foreach (var iteration in issues_in_sprint) {
                        Console.WriteLine("Issue iteration =");
                        Console.WriteLine(iteration.name);

                        var current_sprint_issue = new SprintIssue
                        {
                            Sprint = sprint,
                            Issue = iteration
                        };

                        Console.WriteLine("Current sprint issue Sprint Details:");
                        Console.WriteLine(current_sprint_issue.SprintId);
                        Console.WriteLine(current_sprint_issue.Sprint.name);

                        Console.WriteLine("Current sprint issue Issue Details:");
                        Console.WriteLine(current_sprint_issue.IssueId);
                        Console.WriteLine(current_sprint_issue.Issue.name);

                        sprint.issues.Remove(current_sprint_issue);

                        var issue_removed_from_sprint = await _context.SaveChangesAsync() > 0;

                        Console.WriteLine("Issue removed from sprint result:");
                        Console.WriteLine(issue_removed_from_sprint);

                        foreach(var sprint_iteration in selected_project.sprints) {
                            if(sprint_iteration.Sprint.name == "Backlog") {
                                var backlog_sprint = await _context.Sprints.Include(i => i.issues).FirstOrDefaultAsync(x => x.Id.ToString().ToLower() == sprint_iteration.SprintId.ToString().ToLower());
                                var future_sprint_issue = new SprintIssue
                                {
                                    Sprint = backlog_sprint,
                                    Issue = iteration
                                };
                                Console.WriteLine("Future sprint issue details:");
                                Console.WriteLine(future_sprint_issue.Sprint.name);
                                Console.WriteLine(future_sprint_issue.Issue.name);
                                backlog_sprint.issues.Add(future_sprint_issue);
                                var issue_added_to_backlog = await _context.SaveChangesAsync() > 0;
                                Console.WriteLine("Issue added to backlog result: ");
                                Console.WriteLine(issue_added_to_backlog);
                            }
                        }
                    }

                    var sprint_to_remove_from_project = new ProjectSprint
                    {
                        Project = selected_project,
                        Sprint = sprint
                    };

                    selected_project.sprints.Remove(sprint_to_remove_from_project);

                    var result = await _context.SaveChangesAsync() > 0;

                    return result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Problem closing sprint.");

                    */
            }
        }
    }
}
