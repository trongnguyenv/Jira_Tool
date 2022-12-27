using AutoMapper;
using Domain;
using MediatR;
using Persistence;

namespace Application.Sprints
{
    public class Edit
    {
        public class Command : IRequest
        {
            public Sprint Sprint { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var sprint = await _context.Sprints.FindAsync(request.Sprint.Id);

                _mapper.Map(request.Sprint, sprint);

                await _context.SaveChangesAsync();

                return Unit.Value;
            }
        }
    }
}
