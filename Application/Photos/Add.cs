using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos
{
    public class Add
    {
        public class Command : IRequest<Result<Photo>>
        {
            public IFormFile File { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Photo>>
        {
            private readonly DataContext _context;
            private readonly IPhotoAccessor _photoAccessor;

            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IPhotoAccessor photoAccessor, IUserAccessor userAccessor)
            {
                _context = context;
                _photoAccessor = photoAccessor;
                _userAccessor = userAccessor;
            }

            public async Task<Result<Photo>> Handle(Command request, CancellationToken cancellationToken)
            {
                Console.WriteLine("Username is");

                Console.WriteLine(_userAccessor.GetUsername());
                var user = await _context.Users.FirstOrDefaultAsync(x => x.Email == _userAccessor.GetUsername());

                Console.WriteLine("Found user");
                Console.WriteLine(user.first_name);
                Console.WriteLine(user.second_name);

                if (user == null) return null;

                var photoUploadResult = await _photoAccessor.AddPhoto(request.File);

                Console.WriteLine("Did photo upload work?");
                Console.WriteLine(photoUploadResult.Url);

                var photo = new Photo
                {
                    Url = photoUploadResult.Url,
                    Id = photoUploadResult.PublicId
                };

                var assignee = await _context.Assignees
                    .Include(p => p.Photo)
                    .FirstOrDefaultAsync(assignee => assignee.id_app_user == user.Id);

                assignee.Photo = photo;

                var result = await _context.SaveChangesAsync() > 0;

                if (result) return Result<Photo>.Success(photo);

                return Result<Photo>.Failure("Problem adding photo");
            }
        }
    }
}
