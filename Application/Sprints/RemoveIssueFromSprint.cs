using Application.Core;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Sprints
{
    public class RemoveIssueFromSprint
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string sprint_id { get; set; }

            public string issue_name { get; set; }

            public string issue_id { get; set; }
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
                var sprint = await _context.Sprints
                    .Include(i => i.issues)
                    .FirstOrDefaultAsync(x => x.Id.ToString().ToLower() == request.sprint_id);

                if (sprint == null) return null;

                var issue = await _context.Issues
                    .Include(a => a.assignees)
                    .FirstOrDefaultAsync(x => x.Id.ToString().ToLower() == request.issue_id);

                if (issue == null) return null;

                var currentlyInTheSprint = sprint.issues
                    .FirstOrDefault(x => x.IssueId.ToString() == request.issue_id);

                if (currentlyInTheSprint != null)
                {
                    sprint.issues.Remove(currentlyInTheSprint);
                }

                var result = await _context.SaveChangesAsync() > 0;

                return result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Problem removing issue from sprint.");
            }
        }
    }
}
