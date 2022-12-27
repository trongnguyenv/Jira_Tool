export interface Invitation {
    id: string;
    inviter_account_id: string;
    invitee_account_email: string;
    project_to_collaborate_on_id: string;
    invitation_status: string;
}

