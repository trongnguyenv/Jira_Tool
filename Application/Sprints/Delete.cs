using MediatR;
using Persistence;

namespace Application.Sprints
{
    public class Delete
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
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
                var sprint = await _context.Sprints.FindAsync(request.Id);
                _context.Remove(sprint);
                await _context.SaveChangesAsync();
                return Unit.Value;
            }
        }
    }
}
