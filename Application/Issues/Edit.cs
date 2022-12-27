using AutoMapper;
using Domain;
using MediatR;
using Persistence;

namespace Application.Issues
{
    public class Edit
    {
        public class Command : IRequest
        {
            public Issue Issue { get; set; }
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
                var issue = await _context.Issues.FindAsync(request.Issue.Id);

                _mapper.Map(request.Issue, issue);

                await _context.SaveChangesAsync();

                return Unit.Value;
            }
        }
    }
}
