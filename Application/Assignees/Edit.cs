using AutoMapper;
using Domain;
using MediatR;
using Persistence;

namespace Application.Assignees
{
    public class Edit
    {
        public class Command : IRequest
        {
            public Assignee Assignee { get; set; }
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
                var assignee = await _context.Assignees.FindAsync(request.Assignee.Id);

                _mapper.Map(request.Assignee, assignee);

                await _context.SaveChangesAsync();

                return Unit.Value;
            }
        }
    }
}
