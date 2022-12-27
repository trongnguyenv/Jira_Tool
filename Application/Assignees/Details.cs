using Domain;
using MediatR;
using Persistence;

namespace Application.Assignees
{
    public class Details
    {
        public class Query : IRequest<Assignee>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Query, Assignee>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Assignee> Handle(Query request, CancellationToken cancellationToken)
            {
                return await _context.Assignees.FindAsync(request.Id);
            }
        }
    }
}
