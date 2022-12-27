using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class RegisterDto
    {
        [Required]
        [EmailAddress]
        public string email { get; set; }

        /*
        [Required]
        [RegularExpression("(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{4,8}$", ErrorMessage = "Password must be 4 - 8 characters long and contain one upper-case letter, one lower-case letter and one number.")]
        public string Password { get; set; }
        */

        [Required]
        public string user_name { get; set; }

        [Required]
        public string first_name { get; set; }

        [Required]
        public string second_name { get; set; }

        public List<string> accessible_project_ids { get; set; } = new List<string>();
    }
}
