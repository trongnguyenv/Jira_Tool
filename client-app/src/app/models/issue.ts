import { Assignee } from './assignee';
import { Comment } from './comment';

export interface Issue {
    id: string;
    name: string;
    description: string;
    description_text: string;
    priority: string;
    original_estimated_duration: string;
    //currently_estimated_duration: string;
    time_logged: string;
    time_remaining: string;
    status: string;
    issue_type: string;
    created_at: string;
    updated_at: string;
    sort_order: number;
    //reporter: Assignee | null;
    //team_id: string;
    project_id: string;
    //reviewer_id: string;
    reporter_id: string;
    sprint_id: string;
    assignees: Assignee[];
    comments?: Comment[];
}
