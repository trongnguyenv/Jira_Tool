using Application.Core;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Sprints
{
    public class AddIssueToSprint
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

                var alreadyInTheSprint = sprint.issues
                    .FirstOrDefault(x => x.IssueId.ToString() == request.issue_id);

                if (alreadyInTheSprint != null)
                {
                    sprint.issues.Remove(alreadyInTheSprint);
                }

                var issueToAdd = new SprintIssue
                {
                    Sprint = sprint,
                    Issue = issue
                };

                sprint.issues.Add(issueToAdd);

                var result = await _context.SaveChangesAsync() > 0;

                return result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Problem adding issue to sprint.");
            }
        }
    }
}
