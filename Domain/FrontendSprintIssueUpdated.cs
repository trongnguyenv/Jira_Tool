namespace Domain
{
    public class FrontEndSprintIssueUpdated
    {
        public string source_sprint_id { get; set; }
        public string destination_sprint_id { get; set; }
        public Issue issue { get; set; }
        public string issue_name { get; set; }
        public string issue_id { get; set; }
    }
}
