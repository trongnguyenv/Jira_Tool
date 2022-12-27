using Domain;
using Microsoft.AspNetCore.Identity;

namespace Persistence
{
    public class Seed
    {
        public static async Task SeedData(DataContext context, UserManager<AppUser> userManager)
        {
            if (!userManager.Users.Any())
            {
                var users = new List<AppUser>
                {
                    new AppUser{first_name = "Frig", second_name = "frig", Email = "frig@test.com", UserName = "frig@test.com"},
                    new AppUser{first_name = "Jim", second_name = "jim", Email = "jim@test.com", UserName = "jim@test.com"},
                    new AppUser{first_name = "Sally", second_name = "sally", Email = "sally@test.com", UserName = "sally@test.com"}
                };

                foreach (var user in users)
                {
                    await userManager.CreateAsync(user, "Pa$$w0rd");
                }
            }

            if (context.Issues.Any()) return;

            var issues = new List<Issue>
            {
                new Issue
                {
                    name = "Prefill database with dummy data",
                    description = "Prefill database with dummy data, but with more words",
                    description_text = "I need to put data in the data base so that I can use it to query the system and test that I have data model that is well suited to the problem.",
                    priority = "High",
                    original_estimated_duration = new TimeSpan(0, 2, 30, 0),
                    currently_estimated_duration = new TimeSpan(0, 2, 30, 0),
                    time_logged = new TimeSpan(0),
                    status = "In Progress",
                    created_at = DateTime.Now.AddHours(-1),
                    updated_at = DateTime.Now.AddHours(-1),
                    reporter_id = "",
                    team_id = "",
                    project_id = "",
                    sprint_id = ""
                },
                new Issue
                {
                    name = "Create basic get and post controllers",
                    description = "Create basic get and post controllers but with more words",
                    description_text = "Need to set up some basic GET and POST handlers to test comms between the API and DB.",
                    priority = "Medium",
                    original_estimated_duration = new TimeSpan(0, 2, 30, 0),
                    currently_estimated_duration = new TimeSpan(0, 2, 30, 0),
                    time_logged = new TimeSpan(0),
                    status = "In Progress",
                    created_at = DateTime.Now.AddHours(-1),
                    updated_at = DateTime.Now.AddHours(-1),
                    reporter_id = "",
                    team_id = "",
                    project_id = "1",
                    sprint_id = "1"
                },
                new Issue
                {
                    name = "Watch Top Gun",
                    description = "The original",
                    description_text = "Need to watch the first Top Gun film.",
                    priority = "Low",
                    original_estimated_duration = new TimeSpan(0, 2, 30, 0),
                    currently_estimated_duration = new TimeSpan(0, 2, 30, 0),
                    time_logged = new TimeSpan(0),
                    status = "In Progress",
                    created_at = DateTime.Now.AddHours(-1),
                    updated_at = DateTime.Now.AddHours(-1),
                    reporter_id = "",
                    team_id = "",
                    project_id = "",
                    sprint_id = ""
                },
                new Issue
                {
                    name = "Create a React project for this API",
                    description = "Maybe React 18?",
                    description_text = "Last time I used React they had just released version 16 which was the one where they introduced hooks. There were not very many examples or codebases online to learn from, it was a huge pain in the arse.",
                    priority = "Low",
                    original_estimated_duration = new TimeSpan(0, 2, 30, 0),
                    currently_estimated_duration = new TimeSpan(0, 2, 30, 0),
                    time_logged = new TimeSpan(0),
                    status = "In Progress",
                    created_at = DateTime.Now.AddHours(-1),
                    updated_at = DateTime.Now.AddHours(-1),
                    reporter_id = "",
                    team_id = "",
                    project_id = "",
                    sprint_id = ""
                },
                new Issue
                {
                    name = "Test Quill.js integration",
                    description = "Cool Rich Text Editor components",
                    description_text = "Would like to add a rich text editor for leaving comments etc.",
                    priority = "Low",
                    original_estimated_duration = new TimeSpan(0, 2, 30, 0),
                    currently_estimated_duration = new TimeSpan(0, 2, 30, 0),
                    time_logged = new TimeSpan(0),
                    status = "In Progress",
                    created_at = DateTime.Now.AddHours(-1),
                    updated_at = DateTime.Now.AddHours(-1),
                    reporter_id = "",
                    team_id = "",
                    project_id = "",
                    sprint_id = ""
                },
                new Issue
                {
                    name = "Create a db table for Issue comments",
                    description = "Comments need their own table since im using a relational db",
                    description_text = "They will have a many-to-one relationship with Issues. Primary key will be comment_id. Foreign keys will be commenter_id and issue_id.",
                    priority = "Low",
                    original_estimated_duration = new TimeSpan(0, 2, 30, 0),
                    currently_estimated_duration = new TimeSpan(0, 2, 30, 0),
                    time_logged = new TimeSpan(0),
                    status = "In Progress",
                    created_at = DateTime.Now.AddHours(-1),
                    updated_at = DateTime.Now.AddHours(-1),
                    reporter_id = "",
                    team_id = "",
                    project_id = "",
                    sprint_id = ""
                },
                new Issue
                {
                    name = "Create POST functions to create Issue, Comment, Sprint, Team, TeamMember, and Project.",
                    description = "",
                    description_text = "These will require middlewares to determine the user performing the action and which actions they can perform.",
                    priority = "High",
                    original_estimated_duration = new TimeSpan(0, 2, 30, 0),
                    currently_estimated_duration = new TimeSpan(0, 2, 30, 0),
                    time_logged = new TimeSpan(0),
                    status = "In Progress",
                    created_at = DateTime.Now.AddHours(-1),
                    updated_at = DateTime.Now.AddHours(-1),
                    reporter_id = "",
                    team_id = "",
                    project_id = "",
                    sprint_id = ""
                },
                new Issue
                {
                    name = "Create POST functions to update Issue, Comment, Sprint, Team, TeamMember, and Project.",
                    description = "Different from creating, these functions will facilitate the main purpose of the app which is to reflect the state of the project and its various issues over time.",
                    description_text = "These will require middlewares to determine the user performing the action and which actions they can perform.",
                    priority = "High",
                    original_estimated_duration = new TimeSpan(0, 2, 30, 0),
                    currently_estimated_duration = new TimeSpan(0, 2, 30, 0),
                    time_logged = new TimeSpan(0),
                    status = "In Progress",
                    created_at = DateTime.Now.AddHours(-1),
                    updated_at = DateTime.Now.AddHours(-1),
                    reporter_id = "",
                    team_id = "",
                    project_id = "",
                    sprint_id = ""
                }
            };

            var projects = new List<Project>
            {
                new Project
                {
                    name = "Shmira",

                    description = "Make a Project Management tool",

                    description_text = "This would be a cool project to make for a portfolio, then I could use the project to manage all subsequent portfolio projects.",

                    priority = "High",

                    status = "",

                    created_at = DateTime.Now.AddHours(-2),

                    updated_at = DateTime.Now.AddHours(-2)
                },
                new Project
                {
                    name = "Step Tracker",

                    description = "Make a step tracker app",

                    description_text = "I think this would be a cool project, if I could replace my current step tracker by making it more desirable to use than the one I use on a daily basis then I think I can call it a success.",

                    priority = "High",

                    status = "",

                    created_at = DateTime.Now.AddHours(-2),

                    updated_at = DateTime.Now.AddHours(-2)
                },
                new Project
                {
                    name = "IoT Scales",

                    description = "It would be cool if I could make a pair of scales that could connect to my step tracker and automatically record my weight in the app when I step on the scales.",

                    description_text = "Im not sure how easy or hard this will be - i've done some C programming so the software bit wont be the bottleneck but I don't know how easy the hardware part of making scales that can weight a human person will be. Realistically if big companies can productionise them for like $40 then making them myself will probably cost like $100 just in raw material, but I could be way off, maybe its less, we'll see.",

                    priority = "Low",

                    status = "",

                    created_at = DateTime.Now.AddHours(-2),

                    updated_at = DateTime.Now.AddHours(-2)
                }
            };

            var sprints = new List<Sprint>
            {
                new Sprint
                {
                    name = "Sprint 1",

                    description = "First sprint",

                    description_text = "Lets see how much we can get done, Shmira can get done in a couple of weekends",

                    priority = "High",

                    created_at = DateTime.Now,

                    updated_at = DateTime.Now,

                    date_start = DateTime.Now,

                    date_end = DateTime.Now.AddDays(14),

                    project_id = "",

                    status = "Open",

                    closing_summary = ""
                }
            };

            var assignees = new List<Assignee>
            {
                new Assignee
                {
                    first_name = "Davide",

                    second_name = "Lorino",

                    employment_contract_type = "",

                    created_at = DateTime.Now,

                    updated_at = DateTime.Now,

                    id_of_direct_report = ""
                },
                new Assignee
                {
                    first_name = "Mario",

                    second_name = "Mario",

                    employment_contract_type = "",

                    created_at = DateTime.Now,

                    updated_at = DateTime.Now,

                    id_of_direct_report = ""
                },
                new Assignee
                {
                    first_name = "Luigi",

                    second_name = "Mario",

                    employment_contract_type = "",

                    created_at = DateTime.Now,

                    updated_at = DateTime.Now,

                    id_of_direct_report = ""
                },
                new Assignee
                {
                    first_name = "King",

                    second_name = "Bowser",

                    employment_contract_type = "",

                    created_at = DateTime.Now,

                    updated_at = DateTime.Now,

                    id_of_direct_report = ""
                },
                new Assignee
                {
                    first_name = "Princess",

                    second_name = "Peach",

                    employment_contract_type = "",

                    created_at = DateTime.Now,

                    updated_at = DateTime.Now,

                    id_of_direct_report = ""
                }
            };

            await context.Issues.AddRangeAsync(issues);
            await context.Projects.AddRangeAsync(projects);
            await context.Sprints.AddRangeAsync(sprints);
            await context.Assignees.AddRangeAsync(assignees);
            await context.SaveChangesAsync();
        }
    }
}
