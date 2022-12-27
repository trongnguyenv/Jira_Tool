import { Sprint } from './sprint';
import { Assignee } from './assignee';

export interface Project {
    id: string;
    name: string;
    description: string;
    description_text: string;
    priority: string;
    //original_estimated_duration: string;
    //currently_estimated_duration: string;
    //time_logged: string;
    status: string;
    created_at: string;
    sprints: Sprint[];
    assignees: Assignee[];
    //updated_at: string;
    //reporter_id: string;
    //team_id: string;
    //project_id: string;
    //reviewer_id: string;
    //sprint_id: string;
    //assignees: string[];
}
