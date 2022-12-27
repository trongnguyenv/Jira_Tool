using Application.Core;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Issues
{
    public class RemoveAssigneeFromIssue
    {
        public class Command : IRequest<Result<Unit>>
        {
            public FrontendIssueAssignees issue_assignee { get; set; }
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
                var issue = await _context.Issues
                    .Include(a => a.assignees)
                    .FirstOrDefaultAsync(x => x.Id.ToString().ToLower() == request.issue_assignee.IssueId.ToString().ToLower());

                var assignee = await _context.Assignees
                    .FirstOrDefaultAsync(x => x.Id.ToString().ToLower() == request.issue_assignee.AssigneeId.ToString().ToLower());

                var assignee_to_remove = issue.assignees.FirstOrDefault(x => x.AssigneeId.ToString().ToLower() == assignee.Id.ToString().ToLower());

                issue.assignees.Remove(assignee_to_remove);

                var result = await _context.SaveChangesAsync() > 0;

                return result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Problem adding assignees to issue.");
            }
        }
    }
}
