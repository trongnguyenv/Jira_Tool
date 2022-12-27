using Application.Core;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Issues
{
    public class AddComment
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
                Console.WriteLine("Comment received");
                Console.WriteLine(request.Comment.comment);
                Console.WriteLine(request.Comment.comment_posted);
                Console.WriteLine(request.Comment.commenter_assignee_id);

                var issue = await _context.Issues
                    .Include(a => a.comments)
                    .FirstOrDefaultAsync(x => x.Id.ToString() == request.Id);

                Console.WriteLine("Found issue");
                Console.WriteLine(issue.Id);

                if (issue == null) return null;

                var new_comment = new Comment
                {
                    Id = request.Comment.Id,
                    commenter_assignee_id = request.Comment.commenter_assignee_id,
                    comment = request.Comment.comment,
                    comment_posted = request.Comment.comment_posted
                };

                _context.Comments.Add(new_comment);

                var save_comment = await _context.SaveChangesAsync() > 0;

                var comment_from_db = await _context.Comments.FirstOrDefaultAsync(comment => comment.Id == new_comment.Id);

                issue.comments.Add(comment_from_db);

                var result = await _context.SaveChangesAsync() > 0;

                return result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Problem adding comment.");
            }
        }
    }
}
