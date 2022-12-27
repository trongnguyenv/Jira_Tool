namespace Domain
{
    public class IssueAssignee
    {
        public Guid AssigneeId { get; set; }

        public Assignee Assignee { get; set; }

        public Guid IssueId { get; set; }

        public Issue Issue { get; set; }

        public bool isOwner { get; set; }
    }
}
