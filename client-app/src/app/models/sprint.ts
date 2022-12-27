import {Issue} from './issue';

export interface Sprint {
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
    issues: Issue[];
    is_active: boolean;
    date_start: string;
    date_end: string;
    //updated_at: string;
    //reporter_id: string;
    //team_id: string;
    //project_id: string;
    //reviewer_id: string;
    //sprint_id: string;
    //assignees: string[];
}
