using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class DataContext : IdentityDbContext<AppUser>
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Project> Projects { get; set; }
        public DbSet<Issue> Issues { get; set; }
        public DbSet<Sprint> Sprints { get; set; }
        public DbSet<Assignee> Assignees { get; set; }

        public DbSet<Photo> Photos { get; set; }

        public DbSet<Invitation> Invites { get; set; }

        public DbSet<IssueAssignee> IssueAssignees { get; set; }

        public DbSet<SprintIssue> SprintIssues { get; set; }

        public DbSet<ProjectAssignee> ProjectAssignees { get; set; }

        public DbSet<Comment> Comments { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<IssueAssignee>(x => x.HasKey(ia => new { ia.AssigneeId, ia.IssueId }));

            builder.Entity<IssueReporter>(x => x.HasKey(ir => new { ir.ReporterId, ir.IssueId }));

            builder.Entity<ProjectAssignee>(x => x.HasKey(pa => new { pa.ProjectId, pa.AssigneeId }));

            builder.Entity<ProjectAssignee>()
                .HasOne(p => p.Project)
                .WithMany(a => a.assignees);

            builder.Entity<IssueAssignee>()
                .HasOne(a => a.Assignee)
                .WithMany(i => i.issues)
                .HasForeignKey(ia => ia.AssigneeId);

            builder.Entity<IssueAssignee>()
                .HasOne(i => i.Issue)
                .WithMany(a => a.assignees)
                .HasForeignKey(ia => ia.IssueId);

            builder.Entity<SprintIssue>(x => x.HasKey(si => new { si.SprintId, si.IssueId }));

            builder.Entity<SprintIssue>()
                .HasOne(s => s.Sprint)
                .WithMany(i => i.issues);
            //.HasForeignKey(si => si.SprintId);

            builder.Entity<ProjectSprint>(x => x.HasKey(ps => new { ps.ProjectId, ps.SprintId }));
        }
    }
}
