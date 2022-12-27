using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Assignees
{
    public class FindByAppUser
    {
        public class Query : IRequest<Assignee>
        {
            public string id { get; set; }
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
                return await _context.Assignees.FirstOrDefaultAsync(x => x.id_app_user == request.id);
            }
        }
    }
}
