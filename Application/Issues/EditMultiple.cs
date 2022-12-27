using Application.Projects;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Issues
{
    public class EditMultiple
    {
        public class Command : IRequest<ProjectDto>
        {
            public List<Issue> Issues { get; set; }

            public string Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, ProjectDto>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper AutoMapper)
            {
                _context = context;
                _mapper = AutoMapper;
            }

            public async Task<ProjectDto> Handle(Command request, CancellationToken cancellationToken)
            {
                var all_issues = await _context.Issues.ToListAsync();
                foreach (var current_issue in request.Issues)
                {
                    var issue = all_issues.Find(i => i.Id == current_issue.Id);
                    _mapper.Map(current_issue, issue);
                }
                await _context.SaveChangesAsync();

                Console.WriteLine("The request id is");
                Console.WriteLine(request.Id);

                var project = await _context.Projects
                .ProjectTo<ProjectDto>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync(x => x.Id == request.Id);

                Console.WriteLine("Project Id found =");
                Console.WriteLine(project.Id);

                return project;

                //return Unit.Value;
            }
        }
    }
}
