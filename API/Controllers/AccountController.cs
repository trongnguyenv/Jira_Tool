using API.DTOs;
using API.Services;
using AutoMapper;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System.Security.Claims;

namespace API.Controllers
{
    [AllowAnonymous]
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;

        private readonly SignInManager<AppUser> _signInManager;

        private readonly TokenService _tokenService;

        private readonly DataContext _context;

        private readonly IMapper _mapper;

        public AccountController(UserManager<AppUser> userManager,
            SignInManager<AppUser> signInManager, TokenService tokenService, DataContext context,
            IMapper mapper)
        {
            _signInManager = signInManager;
            _userManager = userManager;
            _tokenService = tokenService;
            _context = context;
            _mapper = mapper;
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserWithIdDto>> Login(LoginDto loginDto)
        {
            var user = await _userManager.FindByEmailAsync(loginDto.email);

            if (user == null) return Unauthorized();

            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.password, false);

            if (result.Succeeded)
            {
                var user_with_id = new UserWithIdDto
                {
                    id = user.Id,
                    first_name = user.first_name,
                    second_name = user.second_name,
                    email = user.Email,
                    Image = null,
                    Token = _tokenService.CreateToken(user)
                };
                return user_with_id;
            }
            return Unauthorized();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UserDto>> GetAccount(string id)
        {
            var account = await _userManager.FindByIdAsync(id);

            if (account == null) return NotFound();

            return CreateUserObject(account);
        }

        [HttpPut("update")]
        public async Task<ActionResult<string>> UpdateAccount(UserDto account)
        {
            var db_account = await _userManager.FindByEmailAsync(account.email.ToUpper());
            var db_assignee = await _context.Assignees.FirstOrDefaultAsync(assignee => assignee.id_app_user == db_account.Id);
            db_assignee.image = account.Image;
            _mapper.Map(account, db_account);
            await _context.SaveChangesAsync();
            return "Update successful";
        }

        [HttpPost("activate")]
        public async Task<ActionResult<UserDto>> Activate(LoginDto activateDto)
        {
            var user = await _userManager.FindByEmailAsync(activateDto.email.ToUpper());
            var result = await _userManager.ChangePasswordAsync(user, "Pa$$w0rd", activateDto.password);
            var saved = await _context.SaveChangesAsync();
            if (result.Succeeded)
            {
                return CreateUserObject(user);
            }
            return BadRequest("Problem activating account");
        }

        [HttpPost("checkStatus")]
        public async Task<ActionResult<string>> checkAccountRegistrationStatus(LoginDto invitee_email)
        {
            var user = await _userManager.FindByEmailAsync(invitee_email.email.ToUpper());
            if (user == null)
            {
                return "User not registered";
            }
            else
            {
                return "User registered";
            }
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserWithIdDto>> Register(RegisterDto registerDto)
        {
            if (await _userManager.Users.AnyAsync(x => x.Email.ToLower() == registerDto.email.ToLower()))
            {
                ModelState.AddModelError("email", "Email taken");
                Console.WriteLine("Email taken");
                return ValidationProblem(ModelState);
            }

            var user = new AppUser
            {
                Email = registerDto.email,
                first_name = registerDto.first_name,
                second_name = registerDto.second_name,
                UserName = registerDto.email
            };

            Console.WriteLine("Creating user");
            Console.WriteLine(user.Email);
            Console.WriteLine(user.first_name);
            Console.WriteLine(user.second_name);
            Console.WriteLine(user.UserName);

            var temp_password = "Pa$$w0rd";

            var result = await _userManager.CreateAsync(user, temp_password);

            Console.WriteLine("Result is:");
            Console.WriteLine(result);

            if (result.Succeeded)
            {
                var user_from_db = await _userManager.FindByEmailAsync(user.Email);
                var assignee = new Assignee
                {
                    first_name = user_from_db.first_name,
                    second_name = user_from_db.second_name,
                    id_app_user = user_from_db.Id.ToString()
                };

                _context.Assignees.Add(assignee);

                await _context.SaveChangesAsync();

                var assignee_from_db = await _context.Assignees.FirstOrDefaultAsync(current_assignee => current_assignee.id_app_user == assignee.id_app_user);

                var first_project = new Project
                {
                    name = "My First Project",
                    description = "Update the details of this project or create a new one to get started",
                    owner_id = assignee_from_db.Id.ToString()
                };

                _context.Projects.Add(first_project);

                await _context.SaveChangesAsync();

                var project_from_db = await _context.Projects.FirstOrDefaultAsync(current_project => current_project.owner_id == first_project.owner_id);

                var project_assignee = new ProjectAssignee
                {
                    AssigneeId = assignee_from_db.Id,
                    ProjectId = project_from_db.Id
                };

                var backlog_sprint = new Sprint
                {
                    name = "Backlog",
                    project_id = project_from_db.Id.ToString()
                };

                _context.Sprints.Add(backlog_sprint);

                await _context.SaveChangesAsync();

                var sprint_from_db = await _context.Sprints.FirstOrDefaultAsync(current_sprint => current_sprint.project_id == backlog_sprint.project_id);

                var project_sprint = new ProjectSprint
                {
                    ProjectId = project_from_db.Id,
                    SprintId = sprint_from_db.Id
                };

                project_from_db.assignees.Add(project_assignee);
                project_from_db.sprints.Add(project_sprint);

                await _context.SaveChangesAsync();

                var created_user = await _userManager.FindByEmailAsync(user.Email);

                var user_with_id = new UserWithIdDto
                {
                    id = created_user.Id,
                    first_name = user.first_name,
                    second_name = user.second_name,
                    email = user.Email,
                    Image = null,
                    Token = _tokenService.CreateToken(user)
                };
                return (user_with_id);
            };
            return BadRequest("Problem registering user.");
        }

        [HttpGet]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var user = await _userManager.FindByEmailAsync(User.FindFirstValue(ClaimTypes.Email));

            return CreateUserObject(user);
        }

        [HttpGet("all")]
        public async Task<ActionResult<List<UserWithIdDto>>> GetAllAccounts()
        {
            var users = await _userManager.Users.ToListAsync();

            var user_list = new List<UserWithIdDto>();

            foreach (var user in users)
            {
                user_list.Add(CreateUserObjectWithId(user));
            }

            return user_list;
        }

        private UserDto CreateUserObject(AppUser user)
        {
            return new UserDto
            {
                first_name = user.first_name,
                second_name = user.second_name,
                email = user.Email,
                Image = null,
                Token = _tokenService.CreateToken(user)
            };
        }

        private UserWithIdDto CreateUserObjectWithId(AppUser user)
        {
            return new UserWithIdDto
            {
                id = user.Id,
                first_name = user.first_name,
                second_name = user.second_name,
                email = user.Email,
                Image = null,
                Token = _tokenService.CreateToken(user)
            };
        }
    }
}
