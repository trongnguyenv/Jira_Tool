namespace Domain
{
    public class ProjectAssignee
    {
        public Guid AssigneeId { get; set; }

        public Assignee Assignee { get; set; }

        public Guid ProjectId { get; set; }

        public Project Project { get; set; }
    }
}
