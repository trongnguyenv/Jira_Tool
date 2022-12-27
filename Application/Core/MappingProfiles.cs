using Application.Assignees;
using Application.Issues;
using Application.Projects;
using Application.Sprints;
using AutoMapper;
using Domain;

namespace Application.Core
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Issue, Issue>();
            CreateMap<Assignee, Assignee>();
            CreateMap<Project, Project>();
            CreateMap<Sprint, Sprint>();
            CreateMap<Project, ProjectDto>();
            CreateMap<Issue, IssueDto>();
            CreateMap<IssueAssignee, AssigneeDto>();

            CreateMap<IssueAssignee, AssigneeDto>()
                .ForMember(d => d.Id, o => o.MapFrom(s => s.Assignee.Id))
                .ForMember(d => d.Photo, o => o.MapFrom(s => s.Assignee.Photo))
                .ForMember(d => d.id_app_user, o => o.MapFrom(s => s.Assignee.id_app_user))
                .ForMember(d => d.first_name, o => o.MapFrom(s => s.Assignee.first_name))
                .ForMember(d => d.second_name, o => o.MapFrom(s => s.Assignee.second_name))
                .ForMember(d => d.email, o => o.MapFrom(s => s.Assignee.email))
                .ForMember(d => d.employment_contract_type, o => o.MapFrom(s => s.Assignee.employment_contract_type));

            CreateMap<SprintIssue, IssueDto>()
                .ForMember(d => d.Id, o => o.MapFrom(s => s.Issue.Id))
                .ForMember(d => d.name, o => o.MapFrom(s => s.Issue.name))
                .ForMember(d => d.description, o => o.MapFrom(s => s.Issue.description))
                .ForMember(d => d.reporter_id, o => o.MapFrom(s => s.Issue.reporter_id))
                .ForMember(d => d.issue_type, o => o.MapFrom(s => s.Issue.issue_type))
                .ForMember(d => d.sort_order, o => o.MapFrom(s => s.Issue.sort_order))
                .ForMember(d => d.project_id, o => o.MapFrom(s => s.Issue.project_id))
                .ForMember(d => d.time_logged, o => o.MapFrom(s => s.Issue.time_logged))
                .ForMember(d => d.time_remaining, o => o.MapFrom(s => s.Issue.time_remaining))
                .ForMember(d => d.description_text, o => o.MapFrom(s => s.Issue.description_text))
                .ForMember(d => d.status, o => o.MapFrom(s => s.Issue.status))
                .ForMember(d => d.created_at, o => o.MapFrom(s => s.Issue.created_at))
                .ForMember(d => d.updated_at, o => o.MapFrom(s => s.Issue.updated_at))
                .ForMember(d => d.sprint_id, o => o.MapFrom(s => s.Sprint.Id.ToString().ToLower()))
                .ForMember(d => d.priority, o => o.MapFrom(s => s.Issue.priority))
                .ForMember(d => d.comments, o => o.MapFrom(s => s.Issue.comments))
                .ForMember(d => d.original_estimated_duration, o => o.MapFrom(s => s.Issue.original_estimated_duration))
                .ForMember(d => d.assignees, o => o.MapFrom(s => s.Issue.assignees));

            CreateMap<ProjectSprint, SprintDto>()
                .ForMember(d => d.Id, o => o.MapFrom(s => s.Sprint.Id))
                .ForMember(d => d.name, o => o.MapFrom(s => s.Sprint.name))
                .ForMember(d => d.description, o => o.MapFrom(s => s.Sprint.description))
                .ForMember(d => d.is_active, o => o.MapFrom(s => s.Sprint.is_active))
                .ForMember(d => d.description_text, o => o.MapFrom(s => s.Sprint.description_text))
                .ForMember(d => d.priority, o => o.MapFrom(s => s.Sprint.priority))
                .ForMember(d => d.date_start, o => o.MapFrom(s => s.Sprint.date_start))
                .ForMember(d => d.date_end, o => o.MapFrom(s => s.Sprint.date_end))
                .ForMember(d => d.issues, o => o.MapFrom(s => s.Sprint.issues));

            CreateMap<ProjectAssignee, AssigneeDto>()
                .ForMember(d => d.Id, o => o.MapFrom(s => s.Assignee.Id))
                .ForMember(d => d.first_name, o => o.MapFrom(s => s.Assignee.first_name))
                .ForMember(d => d.second_name, o => o.MapFrom(s => s.Assignee.second_name))
                .ForMember(d => d.id_app_user, o => o.MapFrom(s => s.Assignee.id_app_user))
                .ForMember(d => d.email, o => o.MapFrom(s => s.Assignee.email))
                .ForMember(d => d.Photo, o => o.MapFrom(s => s.Assignee.Photo))
                .ForMember(d => d.employment_contract_type, o => o.MapFrom(s => s.Assignee.employment_contract_type));

            CreateMap<Project, ProjectDto>()
                .ForMember(d => d.Id, o => o.MapFrom(s => s.Id))
                .ForMember(d => d.name, o => o.MapFrom(s => s.name))
                .ForMember(d => d.description, o => o.MapFrom(s => s.description))
                .ForMember(d => d.sprints, o => o.MapFrom(s => s.sprints))
                .ForMember(d => d.created_at, o => o.MapFrom(s => s.created_at))
                .ForMember(d => d.updated_at, o => o.MapFrom(s => s.updated_at));

            CreateMap<Sprint, SprintDto>()
                .ForMember(d => d.Id, o => o.MapFrom(s => s.Id));
        }
    }
}
