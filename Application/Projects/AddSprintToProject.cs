using Application.Core;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Projects
{
    public class AddSprintToProject
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string project_id { get; set; }

            public string sprint_name { get; set; }

            public string sprint_id { get; set; }
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
                Console.WriteLine("Project Id =");
                Console.WriteLine(request.project_id);
                Console.WriteLine("Sprint Id =");
                Console.WriteLine(request.sprint_id);

                var project = await _context.Projects
                    .Include(s => s.sprints)
                    .FirstOrDefaultAsync(x => x.Id.ToString().ToLower() == request.project_id.ToString().ToLower());

                if (project == null) return null;

                var backlog_sprint = new Sprint
                {
                    name = "Backlog",
                    Id = new Guid()
                };

                var existing_sprint = await _context.Sprints
                    .Include(i => i.issues)
                    .FirstOrDefaultAsync(x => x.Id.ToString().ToLower() == request.sprint_id.ToString().ToLower());

                var backlogSprintToAdd = new ProjectSprint
                {
                    Project = project,
                    Sprint = backlog_sprint
                };

                var existingSprintToAdd = new ProjectSprint
                {
                    Project = project,
                    Sprint = existing_sprint
                };

                if (request.sprint_name == "Backlog")
                {
                    Console.WriteLine("Backlog sprint adder triggered");
                    project.sprints.Add(backlogSprintToAdd);
                }
                else
                {
                    Console.WriteLine("Existing sprint adder triggered");
                    project.sprints.Add(existingSprintToAdd);
                }

                var result = await _context.SaveChangesAsync() > 0;

                return result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Problem adding sprint to project.");
            }
        }
    }
}
