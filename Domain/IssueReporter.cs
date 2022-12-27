namespace Domain
{
    public class IssueReporter
    {
        public Guid ReporterId { get; set; }

        public Assignee Reporter { get; set; }

        public Guid IssueId { get; set; }

        public Issue Issue { get; set; }

        public bool isOwner { get; set; }
    }
}
