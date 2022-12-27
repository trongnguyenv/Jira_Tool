using Application.Core;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Invites
{
    public class Decline
    {
        public class Query : IRequest<Result<Unit>>
        {
            public string invite_id { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<Unit>>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Result<Unit>> Handle(Query request, CancellationToken cancellationToken)
            {
                var invite = await _context.Invites.FirstOrDefaultAsync(invite => invite.Id == request.invite_id);
                Console.WriteLine("Invite found =");
                Console.WriteLine(invite.Id);
                var invites = await _context.Invites.ToListAsync();
                Console.WriteLine("All invites=");
                Console.WriteLine(invites.Count);
                _context.Invites.Remove(invite);
                Console.WriteLine("All invites after removal =");
                Console.WriteLine(invites.Count);

                var result = await _context.SaveChangesAsync() > 0;

                var invite2 = await _context.Invites.FirstOrDefaultAsync(invite => invite.Id == request.invite_id);

                Console.WriteLine("Did we find the invite again?");
                Console.WriteLine(invite2.Id);

                return result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Problem deleting invite.");
            }
        }
    }
}
