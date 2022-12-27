namespace Domain
{
    public class Issue
    {
        public Guid Id { get; set; }

        public string name { get; set; }

        public string description { get; set; }

        public string description_text { get; set; }

        public string priority { get; set; }

        public TimeSpan original_estimated_duration { get; set; }

        public TimeSpan currently_estimated_duration { get; set; }

        public TimeSpan time_logged { get; set; }

        public TimeSpan time_remaining { get; set; }

        public string status { get; set; }

        public string issue_type { get; set; }

        public DateTime created_at { get; set; }

        public DateTime updated_at { get; set; }

        public string reporter_id { get; set; }

        public string team_id { get; set; }

        public string project_id { get; set; }

        public string reviewer_id { get; set; }

        public string sprint_id { get; set; }

        public int sort_order { get; set; }

        public ICollection<IssueAssignee> assignees { get; set; } = new List<IssueAssignee>();

        public ICollection<Comment> comments { get; set; } = new List<Comment>();
    }
}
