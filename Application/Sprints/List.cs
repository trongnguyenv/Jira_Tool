using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Sprints
{
    public class List
    {
        public class Query : IRequest<Result<List<SprintDto>>>
        { }

        public class Handler : IRequestHandler<Query, Result<List<SprintDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            public async Task<Result<List<SprintDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var sprints = await _context.Sprints
                    .ProjectTo<SprintDto>(_mapper.ConfigurationProvider)
                    .ToListAsync(cancellationToken);
                return Result<List<SprintDto>>.Success(sprints);
            }
        }
    }
}
