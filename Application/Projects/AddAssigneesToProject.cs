using Application.Core;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Projects
{
    public class AddAssigneesToProject
    {
        public class Command : IRequest<Result<Unit>>
        {
            public List<FrontEndProjectAssignee> project_assignees { get; set; }
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
                foreach (var project_assignee in request.project_assignees)
                {
                    var current_project = await _context.Projects
                        .Include(p => p.assignees)
                        .FirstOrDefaultAsync(x => x.Id.ToString().ToLower() == project_assignee.ProjectId.ToLower());

                    var current_assignee = await _context.Assignees
                        .FirstOrDefaultAsync(x => x.Id.ToString().ToLower() == project_assignee.AssigneeId.ToLower());

                    var already_assigned = current_project.assignees.FirstOrDefault(a => a.AssigneeId.ToString().ToLower() == current_assignee.Id.ToString().ToLower());
                    //Console.WriteLine("Already Assigned = ");
                    //Console.WriteLine(already_assigned.AssigneeId);
                    if (already_assigned == null)
                    {
                        var the_project_assignee_to_add = new ProjectAssignee
                        {
                            Project = current_project,
                            Assignee = current_assignee
                        };

                        current_project.assignees.Add(the_project_assignee_to_add);
                    }
                }

                var result = await _context.SaveChangesAsync() > 0;

                return result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Problem adding assignees to project.");
            }
        }
    }
}
