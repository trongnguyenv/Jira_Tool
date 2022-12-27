namespace Domain
{
    public class Sprint
    {
        public Guid Id { get; set; }

        public string name { get; set; }

        public string description { get; set; }

        public string description_text { get; set; }

        public string priority { get; set; }

        public DateTime created_at { get; set; }

        public DateTime updated_at { get; set; }

        public DateTime date_start { get; set; }

        public DateTime date_end { get; set; }

        public bool is_active { get; set; }

        public string project_id { get; set; }

        public string status { get; set; }

        public string closing_summary { get; set; }

        public ICollection<SprintIssue> issues { get; set; } = new List<SprintIssue>();
    }
}
