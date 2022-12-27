namespace Domain
{
    public class Project
    {
        public Guid Id { get; set; }

        public string team_id { get; set; }

        public string name { get; set; }

        public string description { get; set; }

        public string description_text { get; set; }

        public string priority { get; set; }

        public string owner_id { get; set; }

        public string status { get; set; }

        public DateTime created_at { get; set; }

        public DateTime updated_at { get; set; }

        public ICollection<ProjectSprint> sprints { get; set; } = new List<ProjectSprint>();

        public ICollection<ProjectAssignee> assignees { get; set; } = new List<ProjectAssignee>();
    }
}
