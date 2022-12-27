import { makeAutoObservable, runInAction } from 'mobx';
import { Issue } from '../models/issue';
import { Sprint } from '../models/sprint';
import { Assignee } from '../models/assignee';
import { Project } from '../models/project';
import { Comment } from '../models/comment';
import { ProjectSprintAndBacklog } from '../models/projectSprintAndBacklog';
import { SprintIssue } from '../models/sprintissue';
import { IssueAssignee } from '../models/issueAssignee';
import { store } from './store';
import agent from '../api/agent';
import moment from 'moment-timezone';


export default class IssueStore {
    projectRegistry = new Map<string, Project>();
    sprintRegistry = new Map<string, Sprint>();
    issueRegistry = new Map<string, Issue>();
    issueRegistry2 = new Map<string, Issue>();
    relevant_sprints = new Map<string, Sprint>();
    selectedProject: Project | undefined = undefined;
    filteredProject: any = undefined;
    tempProject: any = undefined;
    activeUsers: string[] = [];
    selectedIssue: Issue | undefined = undefined;
    selectedSprint: Sprint | undefined = undefined;
    editMode = false;
    loading = false;
    loadingInitial = true;
    searchFilter = '';

    

    constructor() {
        makeAutoObservable(this)
    }

    get issuesByDate() {
        return Array.from(this.issueRegistry.values())
    }

    get allIssues() {
        return Array.from(this.issueRegistry2.values())
    }

    get allProjects() {
        return Array.from(this.projectRegistry.values());
    }

    get allSprints() {
        return Array.from(this.sprintRegistry.values());
    }

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }

    private setIssue = (issue: Issue) => {
        this.issueRegistry.set(issue.id, issue);
    }

    

    loadIssues = async () => {
        try {
           const issues = await agent.Issues.list();
           runInAction(() => {
            
            issues.map((issue: Issue, index: number) => {
                //issue.sort_order = 0;
                this.issueRegistry.set(issue.id, issue);
           })
         })
        } catch (error) {
            console.log(error);
        }
    }

    loadProjectsInitial = async () => {
        try {
            const projects = await agent.Projects.list();
            runInAction(() => {
                projects.forEach((project: Project) => {
                    this.projectRegistry.set(project.id, project);
                })
                if(window.localStorage.getItem('selected_project_id') !== null){
                    this.selectProject(window.localStorage.getItem('selected_project_id')!);
                } 
                else{
                    this.selectProject(projects[0]);
                    //this.setLoadingInitial(false);
                }
                setTimeout(() => this.setLoadingInitial(false), 3000)
                
            })
        } catch (error) {
            console.log(error);
            this.setLoadingInitial(false);
        }
    }

    loadProjects = async () => {
        try {
            const projects = await agent.Projects.list();
            runInAction(() => {
                projects.forEach((project: Project) => {
                    this.projectRegistry.set(project.id, project);
                })
                //this.setLoadingInitial(false);
            })
        } catch (error) {
            console.log(error);
            this.setLoadingInitial(false);
        }
    }

    loadProject = async (id: string) => {
        try {
            const project = await agent.Projects.details(id);
            runInAction(() => {
                this.projectRegistry.set(project.id, project);
            })
        } catch (error) {
            console.log(error);
        }
    }

    loadSprints = async () => {
        try {
            const sprints = await agent.Sprints.list();
            runInAction(() => {
                sprints.forEach((sprint: Sprint) => {
                    this.sprintRegistry.set(sprint.id, sprint);
                })
            })
        } catch (error) {
            console.log(error);
            this.setLoadingInitial(false);
        }
    }


    selectProjectByAssignee = (assignee_id: string, projects: Project[], token: string) => {
        for (const project of projects){
            var assignee_ids: string[] = [];
            var assignee_name = '';
            project.assignees.forEach((assignee: Assignee) => {
                assignee_ids.push(assignee.id);
            })
            if(assignee_ids.includes(store.commonStore.assignee_id!)){
                assignee_name = project.assignees.find(assignee => assignee.id == store.commonStore.assignee_id!)!.first_name;
                if(assignee_name == "Chiaki"){
                    if(project.name !== "My First Project")
                    this.selectedProject = project;
                } else {
                    this.selectedProject = project;
                }
            }
        }
    }

    updateRelevantIssues = (relevant_sprints: Sprint[]) => {
        runInAction(() => {
            this.issueRegistry.clear();
            relevant_sprints.map((sprint) => {
                sprint.issues.map((issue, index) => {
                    this.issueRegistry.set(issue.id, issue);   
                })
            })
        })
        
    }

    filterProject = async () => {
        await this.loadProject(this.selectedProject!.id);
        runInAction(() => {
            if(this.activeUsers.length > 0){
                var project_id = this.selectedProject!.id;
                var current_project = this.projectRegistry.get(project_id);
                this.tempProject = current_project;
                var sprints: Sprint[] = [];
                if(this.searchFilter.length > 0){
                    current_project!.sprints!.map(sprint => {
                        var issues: Issue[] = [];
                        if(sprint.is_active){
                            sprint.issues.map(issue => {
                                var assignees = issue.assignees.filter(assignee => this.activeUsers.includes(assignee.id));
                                if(assignees.length > 0){
                                    if(issue.name.toLowerCase().includes(this.searchFilter.toLowerCase())){
                                        issues.push(issue);
                                    }
                                }
                            })
                        }
                            sprint.issues = issues;
                            sprints.push(sprint);
                        })
                } else {
                    current_project!.sprints!.map(sprint => {
                        var issues: Issue[] = [];
                        if(sprint.is_active){
                            sprint.issues.map(issue => {
                                var assignees = issue.assignees.filter(assignee => this.activeUsers.includes(assignee.id));
                                if(assignees.length > 0){
                                    issues.push(issue);
                                }
                            })
                        }
                            sprint.issues = issues;
                            sprints.push(sprint);
                        })
                }        
                    this.tempProject.sprints = sprints;
                    this.selectedProject = this.tempProject;
        }
        else if(this.searchFilter.length > 0){
            var project_id = this.selectedProject!.id;
            var current_project = this.projectRegistry.get(project_id);
            this.tempProject = current_project;
            var sprints: Sprint[] = [];
            
            current_project!.sprints!.map(sprint => {
                var issues: Issue[] = [];
                if(sprint.is_active){
                    sprint.issues.map(issue => {             
                        if(issue.name.toLowerCase().includes(this.searchFilter.toLowerCase())){
                            issues.push(issue);
                        }
                    })
                }
                    sprint.issues = issues;
                    sprints.push(sprint);
                })
                this.tempProject.sprints = sprints;
                this.selectedProject = this.tempProject;
        }
        else{
            var project_id = this.selectedProject!.id;
            this.selectedProject = this.projectRegistry.get(project_id);
        }
    })
    }

    updateActiveUsers = (user_ids: any) => {
        user_ids.map((user_id: any) => {
            var found = 0;
            var index = 0;  
            for(var i in this.activeUsers){
                if(this.activeUsers[i] === user_id){
                    found = 1;
                    index = this.activeUsers.indexOf(i);
                }
            }
            if(found === 1){
                this.activeUsers = this.activeUsers.filter(user => user !== user_id)
            }
            if(found === 0){
                this.activeUsers.push(user_id);
            }      
        })
    }

    updateRelevantSprints = (selectedProject: Project) => {
        runInAction(() => {
            this.sprintRegistry.clear();
            var relevant_sprints: Sprint[] = []
            selectedProject.sprints.forEach(sprint => {
                relevant_sprints.push(sprint);
                this.sprintRegistry.set(sprint.id, sprint);
            })
            this.updateRelevantIssues(relevant_sprints);
        })

    }

    selectProject = (project_id: string) => {
        runInAction(() => {
            this.loadProjects();
            this.selectedProject = this.projectRegistry.get(project_id);
            if(this.selectedProject !== undefined){
                window.localStorage.setItem('selected_project_id', this.selectedProject.id);
                this.updateRelevantSprints(this.selectedProject!);
                this.setLoadingInitial(false);
            }  
        })
    }

    
    selectIssue = (id: string) => {
        this.selectedIssue = this.issueRegistry.get(id);
    }

    selectSprint = (id: string) => {
        this.selectedSprint = this.sprintRegistry.get(id);
    }

    cancelSelectedIssue = () => {
        this.selectedIssue = undefined;
    }

    openForm = (id?: string) => {
        id ? this.selectIssue(id) : this.cancelSelectedIssue();
    }

    closeForm = () => {
        this.editMode = false;
    }

    addIssueToSprint = async (id: string, sprint_issue: SprintIssue) => {
        this.loading = true;
        try {
            await agent.Sprints.addIssueToSprint(id, sprint_issue);
            runInAction(() => {
                this.loading = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    reloadSelectedProject = async () => {
        var project_id = this.selectedProject!.id;
        await this.loadProjects();
        runInAction(() => {
            this.selectProject(project_id);
            this.loading = false;
        })
    }

    createIssue = async (issue: Issue, sprint_id: string, sprint_issue: SprintIssue, issue_assignees: IssueAssignee[]) => {
        this.loading = true;
        try {
            await agent.Issues.create(issue);
            await agent.Sprints.addIssueToSprint(sprint_id, sprint_issue);
            await agent.Issues.addAssigneesToIssue(issue_assignees);
            await this.loadProjects();
            runInAction(() => {
                var current_project = this.projectRegistry.get(this.selectedProject!.id);
                this.tempProject = current_project;
                this.selectedProject! = this.tempProject;
                
                this.selectedProject!.sprints.map((sprint: Sprint) => {
                    if(sprint.id.toLowerCase() === sprint_issue.sprint_id.toLowerCase()){
                        var the_issue = sprint.issues.find((current_issue: Issue) => current_issue.id.toLowerCase() === issue.id.toLowerCase());
                        var issue_to_pass: any = {
                            ...the_issue
                        }
                        this.issueRegistry.set(issue_to_pass.id, issue_to_pass);
                    }
                })
                
                this.loading = false;
                store.modalStore.closeModal();
            })
        } catch(error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
                store.modalStore.closeModal();
                })
        }
    }

    removeAssigneeFromIssue = async (issue_assignee: IssueAssignee) => {
        this.loading = true;
        var issue_to_update: any = {
            ...this.issuesByDate.find(issue => issue.id === issue_assignee.IssueId)!
        }
        delete issue_to_update['assignees'];
        issue_to_update.updated_at = moment.tz(moment(), 'Australia/Sydney').toISOString(true)
        try {
            await agent.Issues.update(issue_to_update);
            await agent.Issues.removeAssigneeFromIssue(issue_assignee);
            await this.loadProjects();
            await this.loadIssues();
            runInAction(() => {
                var project_id = this.selectedProject!.id;
                var current_project = this.projectRegistry.get(project_id);
                this.tempProject = current_project;
                this.selectedProject! = this.tempProject;
                this.loading = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }


    addAssigneeToIssue = async (issue_assignee: IssueAssignee) => {
        this.loading = true;
        var issue_to_update: any = {
            ...this.issuesByDate.find(issue => issue.id === issue_assignee.IssueId)!
        }
        delete issue_to_update['assignees'];
        issue_to_update.updated_at = moment.tz(moment(), 'Australia/Sydney').toISOString(true)
        try {
            await agent.Issues.update(issue_to_update);
            await agent.Issues.addAssigneeToIssue(issue_assignee);
            await this.loadProjects();
            await this.loadIssues();
            runInAction(() => {
                var project_id = this.selectedProject!.id;
                var current_project = this.projectRegistry.get(project_id);
                this.tempProject = current_project;
                this.selectedProject! = this.tempProject;
                this.loading = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    addCommentToIssue = async (issue_id: string, comment: Comment) => {
        try {
            await agent.Issues.addComment(issue_id, comment);
            await this.loadProject(this.selectedProject!.id);
            runInAction(() => {
                var project_id = this.selectedProject!.id;
                var current_project = this.projectRegistry.get(project_id);
                this.tempProject = current_project;
                this.selectedProject! = this.tempProject;
            })
        } catch (error) {
            console.log(error);
        }
    }

    createProject = async (project: Project, project_sprint: any, project_assignees: any) => {
        this.loading = true;
        try {
            await agent.Projects.create(project);
            await agent.Projects.addSprintToProject(project_sprint);
            await agent.Projects.addAssigneesToProject(project_assignees);
            runInAction(() => {
                this.loadProjects();
                this.loadSprints();
                this.loadIssues();
                this.editMode = false;
                this.loading = false;
                store.modalStore.closeModal();
            })
        } catch(error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    createSprint = async (sprint: Sprint, project_sprint: any) => {
        this.loading = true;
        try {
            await agent.Sprints.create(sprint);
            await agent.Projects.addSprintToProject(project_sprint);
            await this.loadProjects();
            await this.loadSprints();
            runInAction(() => {
                var project_id = this.selectedProject!.id;
                var current_project = this.projectRegistry.get(project_id);
                this.tempProject = current_project;
                this.selectedProject! = this.tempProject;
                var current_sprint = this.sprintRegistry.get(sprint.id);
                this.sprintRegistry.set(sprint.id, current_sprint!);
                store.smallModalStore.closeSmallModal();
                this.loading = false;
            })
        } catch(error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    updateSprint = async (sprint: Sprint) => {
        this.loading = true;
        try {
            await agent.Sprints.update(sprint);
            await this.loadProject(this.selectedProject!.id);
            runInAction(() => {
                this.sprintRegistry.set(sprint.id, sprint);
                var project_id = this.selectedProject!.id;
                var current_project = this.projectRegistry.get(project_id);
                this.tempProject = current_project;
                this.selectedProject! = this.tempProject;
                this.loading = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    updateIssueAndSprint = async (
        source_sprint_id: string,
        destination_sprint_id: string,
        issue_name: string,
        issue_id: string,
        issue: Issue
    ) => {
        this.loading = true;
        var issue_to_send: any = {
            ...issue,
            updated_at: moment.tz(moment(), 'Australia/Sydney').toISOString(true),
        }
        var issue_to_update: any = {
            issue: issue_to_send,
            source_sprint_id: source_sprint_id,
            destination_sprint_id: destination_sprint_id,
            issue_name: issue_to_send.name,
            issue_id: issue_to_send.id
        }
        try {
            await agent.Sprints.moveIssueToDifferentSprint(issue_to_update)
            await this.loadIssues();
            await this.loadProject(this.selectedProject!.id);
            runInAction(() => {                
            var project_id = this.selectedProject!.id;
            var current_project = this.projectRegistry.get(project_id);
            this.tempProject = current_project;
            this.selectedProject! = this.tempProject;
            this.loading = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;      
            })
        }
    }

    closeSprintAndPushIssuesToBacklog = async (project_sprint: ProjectSprintAndBacklog) => {
        this.loading = true;
        try {
            await agent.Sprints.closeSprintAndMoveIssuesToBacklog(project_sprint);
            await this.loadProject(this.selectedProject!.id);
            runInAction(() => {
                var project_id = this.selectedProject!.id;
                var current_project = this.projectRegistry.get(project_id);
                this.tempProject = current_project;
                this.selectedProject! = this.tempProject;
                store.modalStore.closeModal();
                this.loading = false;
            })
        } catch  (error) {
            console.log(error);
            this.loading = false;
        }
    }

    getIssue = async (issueId: string) => {
        this.loading = true;
        try {
            await agent.Issues.details(issueId);
            runInAction(() => {
                this.loading = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    updateIssue = async (issue: Issue) => {
        this.loading = true;
        var issueToSend: any = {
            ...issue,
            updated_at: moment.tz(moment(), 'Australia/Sydney').toISOString(true)
        }
        delete issueToSend['assignees'];
        delete issueToSend['comments'];
        try {
            await agent.Issues.update(issueToSend);
            await this.loadProject(this.selectedProject!.id);
            runInAction(() => {
                var project_id = this.selectedProject!.id;
                var current_project = this.projectRegistry.get(project_id);
                this.tempProject = current_project;
                this.selectedProject! = this.tempProject;
                this.loading = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }


    updateIssues = async (issuesToSend: any[]) => {
        this.loading = true;
        try {
            var project_returned = await agent.Issues.updateMultiple(issuesToSend, this.selectedProject!.id);
            this.projectRegistry.set(project_returned.id, project_returned);
            //await this.loadProject(this.selectedProject!.id);
            runInAction(() => {
                console.log("Project returned =");
                console.log(project_returned);
                
                var project_id = this.selectedProject!.id;
                var current_project = this.projectRegistry.get(project_id);
                this.tempProject = current_project;
                this.selectedProject! = this.tempProject;
                
                this.loading = false;
                console.log("End");
                console.log(moment());
            })
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    deleteIssue = async (id: string) => {
        this.loading = true;
        try {
            await agent.Issues.delete(id);
            runInAction(() => {
                this.issueRegistry.delete(id);
                if (this.selectedIssue?.id === id) this.cancelSelectedIssue();
                this.loading = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }

}