namespace Domain
{
    public class Assignee
    {
        public Guid Id { get; set; }

        public string email { get; set; }

        public string first_name { get; set; }

        public string second_name { get; set; }

        public string employment_contract_type { get; set; }

        public DateTime created_at { get; set; }

        public DateTime updated_at { get; set; }

        public string id_of_direct_report { get; set; }

        public string image { get; set; }

        public Photo Photo { get; set; }

        public string id_app_user { get; set; }

        public ICollection<Project> projects { get; set; } = new List<Project>();

        public ICollection<IssueAssignee> issues { get; set; } = new List<IssueAssignee>();
    }
}
