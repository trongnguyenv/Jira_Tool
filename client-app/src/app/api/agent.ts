import axios, { AxiosResponse } from 'axios';
import { Issue } from '../models/issue';
import { Project } from '../models/project';
import { ProjectSprintAndBacklog } from '../models/projectSprintAndBacklog';
import { Sprint } from '../models/sprint';
import { Assignee } from '../models/assignee';
import { SprintIssue } from '../models/sprintissue';
import { Invitation } from '../models/invitation';
import { Comment } from '../models/comment';
import { SprintIssueUpdated } from '../models/sprintIssueUpdated';
import { Account, AccountFormValues } from '../models/account';
import { store } from '../stores/store';

const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay)
    })
}

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

axios.interceptors.request.use(config => {
    const token = store.commonStore.token;
    if (token) config.headers!.Authorization = `Bearer ${token}`
    return config;
 })

axios.interceptors.response.use(async response => {
    if(process.env.NODE_ENV === 'development') await sleep(1000);
    try {
        return response;
    } catch (error) {
        console.log(error);
        return await Promise.reject(error);
    }
})

const responseBody = <T> (response: AxiosResponse<T>) => response.data;

const requests = {
    get: <T> (url: string) => axios.get(url).then(responseBody),
    post: <T> (url: string, body: {}) => axios.post(url, body).then(responseBody),
    put: <T> (url: string, body: {}) => axios.put(url, body).then(responseBody),
    del: <T> (url: string) => axios.delete(url).then(responseBody)
}

const Issues = {
    list: () => requests.get<Issue[]>('/issues'),
    details: (id: string) => requests.get<Issue>(`/issues/${id}`),
    create: (issue: Issue) => requests.post<Issue>(`/issues`, issue),
    update: (issue: Issue) => requests.put(`issues/${issue.id}`, issue),
    updateMultiple: (issues: Issue[], project_id: string) => requests.post(`issues/update_multiple/${project_id}`, issues),
    delete: (id: string) => requests.del(`issues/${id}`),
    addComment: (issue_id: string, comment: Comment) => requests.post(`issues/comment/${issue_id}`, comment),
    addAssigneesToIssue: (issue_assignees: any) => requests.put(`issues/add_assignees_to_issue`, issue_assignees),
    addAssigneeToIssue: (issue_assignee: any) => requests.put(`issues/add_assignee_to_issue`, issue_assignee),
    removeAssigneeFromIssue: (issue_assignee: any) => requests.put(`issues/remove_assignee_from_issue`, issue_assignee)
}

const Invites = {
    create: (invitation: Invitation) => requests.post('/invites', invitation),
    list: () => requests.get<Invitation[]>('/invites'),
    accept: (invite_id: string) => requests.get(`invites/accept/${invite_id}`),
    decline: (invite_id: string) => requests.get(`invites/decline/${invite_id}`)
}

const Assignees = {
    list: () => requests.get<Assignee[]>(`/assignees`),
    create: (user: Assignee) => requests.post<Assignee>(`/assignees`, user),
    findByAppUserId: (id: string) => requests.get<Assignee>(`/assignees/app_user/${id}`)
}

const Accounts = {
    current: () => requests.get<Account>('/account'),
    details: (id: string) => requests.get(`/account/${id}`),
    list: () => requests.get<Account[]>('/account/all'),
    login: (account: AccountFormValues) => requests.post('/account/login', account),
    update: (account: AccountFormValues) => requests.put('/account/update', account),
    register: (account: AccountFormValues) => requests.post('/account/register', account),
    getactivate: (id: string) => requests.get<Account>(`/account/${id}`),
    postactivate: (account: AccountFormValues) => requests.post<Account>(`/account/activate`, account),
    checkAccountRegistrationStatusByEmail: (account: AccountFormValues) => requests.post(`/account/checkStatus`, account),
    uploadPhoto: (file: Blob) => {
        let formData = new FormData();
        formData.append('File', file);
        return axios.post('photos', formData, {
            headers: {'Content-type': 'multipart/form-data'}
        })
    }
}

const Projects = {
    list: () => requests.get<Project[]>('/projects'),
    details: (id: string) => requests.get<Project>(`/projects/${id}`),
    create: (project: Project) => requests.post<Project>(`/projects`, project),
    addSprintToProject: (project_sprint: any) => requests.put(`projects/add_sprint_to_project`, project_sprint),
    addAssigneesToProject: (project_assignees: any) => requests.put(`projects/add_assignees_to_project`, project_assignees)
}

const Sprints = {
    list: () => requests.get<Sprint[]>('/sprints'),
    create: (sprint: Sprint) => requests.post<Sprint>(`/sprints`, sprint),
    update: (sprint: Sprint) => requests.put(`sprints/${sprint.id}`, sprint),
    addIssueToSprint: (id: string, sprint_issue: SprintIssue) => 
        requests.put(`sprints/${id}/add_issue_to_sprint`, sprint_issue),
    removeIssueFromSprint: (id: string, sprint_issue: SprintIssue) =>
        requests.put(`sprints/${id}/remove_issue_from_sprint`, sprint_issue),
    moveIssueToDifferentSprint: (sprint_issue_updated: SprintIssueUpdated) => 
        requests.put(`sprints/move_issue_to_different_sprint`, sprint_issue_updated),
    closeSprintAndMoveIssuesToBacklog: (sprint_to_close: ProjectSprintAndBacklog) => 
        requests.post(`sprints/close_sprint`, sprint_to_close)
}

const agent = {
    Projects,
    Sprints,
    Issues,
    Assignees,
    Accounts,
    Invites
}

export default agent;