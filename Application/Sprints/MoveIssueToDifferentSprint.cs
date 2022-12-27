using Application.Core;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Sprints
{
    public class MoveIssueToDifferentSprint
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string source_sprint_id { get; set; }

            public string destination_sprint_id { get; set; }

            public string issue_name { get; set; }

            public string issue_id { get; set; }

            public Issue Issue { get; set; }
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
                var issue = await _context.Issues.FindAsync(request.Issue.Id);

                _mapper.Map(request.Issue, issue);

                await _context.SaveChangesAsync();

                var source_sprint = await _context.Sprints
                    .Include(i => i.issues)
                    .FirstOrDefaultAsync(x => x.Id.ToString().ToLower() == request.source_sprint_id);

                if (source_sprint == null) return null;

                var destination_sprint = await _context.Sprints
                    .Include(i => i.issues)
                    .FirstOrDefaultAsync(x => x.Id.ToString().ToLower() == request.destination_sprint_id);

                if (destination_sprint == null) return null;

                var issue_updated = await _context.Issues
                    .Include(a => a.assignees)
                    .FirstOrDefaultAsync(x => x.Id.ToString().ToLower() == request.issue_id);

                if (issue_updated == null) return null;

                var currentlyInTheSourceSprint = source_sprint.issues
                    .FirstOrDefault(x => x.IssueId.ToString() == request.issue_id);

                if (currentlyInTheSourceSprint != null)
                {
                    source_sprint.issues.Remove(currentlyInTheSourceSprint);
                    var issueToAdd = new SprintIssue
                    {
                        Sprint = destination_sprint,
                        Issue = issue_updated
                    };
                    destination_sprint.issues.Add(issueToAdd);
                }

                var result = await _context.SaveChangesAsync() > 0;

                return result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Problem removing issue from sprint.");
            }
        }
    }
}
