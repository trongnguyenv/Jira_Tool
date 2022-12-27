import { Issue } from './issue';

export interface SprintIssueUpdated {
    source_sprint_id: string;
    destination_sprint_id: string;
    issue_name: string;
    issue_id: string;
    issue: Issue;
}
