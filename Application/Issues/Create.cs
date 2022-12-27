using Application.Interfaces;
using Domain;
using MediatR;
using Persistence;

namespace Application.Issues
{
    public class Create
    {
        public class Command : IRequest
        {
            public Issue Issue { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;

            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _context = context;
                _userAccessor = userAccessor;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                _context.Issues.Add(request.Issue);

                await _context.SaveChangesAsync();

                return Unit.Value;
            }
        }
    }
}
