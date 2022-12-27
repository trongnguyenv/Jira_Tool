using Domain;
using MediatR;
using Persistence;

namespace Application.Invites
{
    public class Create
    {
        public class Command : IRequest
        {
            public Invitation Invite { get; set; }
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
                _context.Invites.Add(request.Invite);

                await _context.SaveChangesAsync();

                return Unit.Value;
            }
        }
    }
}
