using Domain;
using MediatR;
using Persistence;

namespace Application.Sprints
{
    public class Create
    {
        public class Command : IRequest
        {
            public Sprint Sprint { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                _context.Sprints.Add(request.Sprint);

                await _context.SaveChangesAsync();

                return Unit.Value;
            }
        }
    }
}
