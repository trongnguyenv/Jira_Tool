import { makeAutoObservable, runInAction } from 'mobx';
import { Issue } from '../models/issue';
import { Sprint } from '../models/sprint';
import { Project } from '../models/project';
import { SprintIssue } from '../models/sprintissue';
import { ProjectAssignee } from '../models/projectAssignee';
import { store } from './store';
import agent from '../api/agent';
import {v4 as uuid} from 'uuid';
import { Assignee } from '../models/assignee';


export default class UserStore {
    
    /*
    projectRegistry = new Map<string, Project>();
    sprintRegistry = new Map<string, Sprint>();
    issueRegistry = new Map<string, Issue>();
    relevant_sprints = new Map<string, Sprint>();
    selectedProject: Project | undefined = undefined;
    selectedIssue: Issue | undefined = undefined;
    editMode = false;
    loading = false;
    loadingInitial = false;
    */
    user_loading = false;
    userRegistry = new Map<string, Assignee>();
    loadingInitial = true;
    user_logged_in = false;


    constructor() {
        makeAutoObservable(this)
    }

    get allUsers() {
        return Array.from(this.userRegistry.values())
    }

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }


    loadUsers = async () => {
        try {
           const users = await agent.Assignees.list();
           users.forEach((assignee: Assignee) => {
            this.userRegistry.set(assignee.first_name, assignee);
         })
         this.setLoadingInitial(false);
        } catch (error) {
            console.log(error);
            this.setLoadingInitial(false);
        }
    }

    createUser = async (user: Assignee, project_assignees: ProjectAssignee[]) => {
        try {
            this.user_loading = true;
            await agent.Assignees.create(user);
            await agent.Projects.addAssigneesToProject(project_assignees);
            runInAction(() => {
                this.user_loading = false;

            })
        }   catch (error) {
            console.log(error);
            runInAction(() => {
                this.user_loading = false;
            })
        }
    }

    addAssigneesToProjects = async (project_assignees: ProjectAssignee[]) => {
        try {
            this.user_loading = true;
            await agent.Projects.addAssigneesToProject(project_assignees);
            runInAction(() => {
                this.user_loading = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.user_loading = false;
            })
        }
    }

  

}