using Application.Core;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Invites
{
    public class Accept
    {
        public class Query : IRequest<Result<Invitation>>
        {
            public string invite_id { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<Invitation>>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Result<Invitation>> Handle(Query request, CancellationToken cancellationToken)
            {
                var invite = await _context.Invites.FirstOrDefaultAsync(invite => invite.Id == request.invite_id);
                var project = await _context.Projects.FirstOrDefaultAsync(project => project.Id.ToString() == invite.project_to_collaborate_on_id);
                var user = await _context.Users.FirstOrDefaultAsync(user => user.Email.ToLower() == invite.invitee_account_email.ToLower());
                var assignee = await _context.Assignees.FirstOrDefaultAsync(assignee => assignee.id_app_user == user.Id);
                invite.invitation_status = "Accepted";

                var the_project_assignee_to_add = new ProjectAssignee
                {
                    Project = project,
                    Assignee = assignee
                };

                project.assignees.Add(the_project_assignee_to_add);

                var result = await _context.SaveChangesAsync() > 0;

                return Result<Invitation>.Success(invite);
            }
        }
    }
}
