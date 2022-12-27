using Application.Core;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Issues
{
    public class AddAssignee
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid issue_id { get; set; }

            public Guid assignee_id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var issue = await _context.Issues
                    .Include(a => a.assignees)
                    .FirstOrDefaultAsync(x => x.Id == request.issue_id);

                if (issue == null) return null;

                var assignee = await _context.Assignees.
                    FirstOrDefaultAsync(x => x.Id == request.assignee_id);

                if (assignee == null) return null;

                var assigned = issue.assignees.
                    FirstOrDefault(x => x.AssigneeId == assignee.Id);

                if (assigned != null)
                    issue.assignees.Remove(assigned);

                if (assigned == null)
                {
                    assigned = new IssueAssignee
                    {
                        Assignee = assignee,
                        Issue = issue
                    };

                    issue.assignees.Add(assigned);
                }

                var result = await _context.SaveChangesAsync() > 0;

                return result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Problem updating assignee.");
            }
        }
    }
}
