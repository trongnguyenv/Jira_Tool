using Application.Core;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Issues
{
    public class DeleteComment
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string Id { get; set; }

            public Comment Comment { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var issue = await _context.Issues
                    .Include(a => a.comments)
                    .FirstOrDefaultAsync(x => x.Id.ToString() == request.Id);

                if (issue == null) return null;

                var comment_to_delete = issue.comments.FirstOrDefault(comment => comment.Id == request.Comment.Id);

                issue.comments.Remove(comment_to_delete);

                var result = await _context.SaveChangesAsync() > 0;

                return result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Problem deleting comment.");
            }
        }
    }
}
