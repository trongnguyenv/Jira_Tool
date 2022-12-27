using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Projects
{
    public class Details
    {
        public class Query : IRequest<Result<ProjectDto>>
        {
            public string Id { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<ProjectDto>>
        {
            private readonly DataContext _context;

            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper AutoMapper)
            {
                _mapper = AutoMapper;
                _context = context;
            }

            public async Task<Result<ProjectDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var project = await _context.Projects
                    .ProjectTo<ProjectDto>(_mapper.ConfigurationProvider)
                    .FirstOrDefaultAsync(x => x.Id == request.Id);

                return Result<ProjectDto>.Success(project);
            }
        }
    }
}
