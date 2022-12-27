namespace Domain
{
    public class Invitation
    {
        public string Id { get; set; }
        public string inviter_account_id { get; set; }
        public string invitee_account_email { get; set; }
        public string project_to_collaborate_on_id { get; set; }
        public string invitation_status { get; set; }
    }
}
