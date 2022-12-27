using Microsoft.AspNetCore.Identity;

namespace Domain
{
    public class AppUser : IdentityUser
    {
        public string DisplayName { get; set; }

        public string Bio { get; set; }

        public string first_name { get; set; }

        public string second_name { get; set; }

        public string assignee_id { get; set; }
    }
}
