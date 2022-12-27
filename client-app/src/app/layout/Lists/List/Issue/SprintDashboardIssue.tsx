
import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { useStore } from '../../../../stores/store';
import { observer } from 'mobx-react-lite';
import { Issue } from '../../../../models/issue';
import NewUpdateIssueForm from '../../../../features/sprints/form/NewUpdateIssueForm';
import { StyledAvatar, AvatarIsActiveLabelBorder } from '../../../../features/sprints/dashboard/Filters/Styles';
import { StyledLabel } from '../../../../features/sprints/form/Styles';
import IssuePriorityIcon from '../../../../layout/IssuePriorityIcon';
import IssueTypeIcon from '../../../../layout/IssueTypeIcon';
import { 
  IssueCardSprintVersion,
  TitleSprintVersion
} from './Styles';

interface Props {
    issue: Issue;
    index: number;
  }

  function renderSelectedIssueType(issue: Issue) {
    if(issue.issue_type == "Story"){
        return(
            <IssueTypeIcon color='#65BA43'type='story' size={14} />
        )
    }
    if(issue.issue_type == "Bug"){
        return(
            <IssueTypeIcon color='#E44D42'  type='bug' size={14} />
        )
    }
    if(issue.issue_type == "Task"){
        return(
            <IssueTypeIcon color='#4FADE6' type='task' size={14} />
        )
    }
  }

export default observer(function SprintBoardListIssue({ issue, index }: Props) {

    const {modalStore, issueStore} = useStore();
    const {selectedIssue} = issueStore;

    return (
        <Draggable draggableId={issue.id} index={index} key={issue.id}>
          {( provided,  snapshot ) => (
              <div
                style={{
                  cursor: 'move', 
                  display: "flex", 
                  overflow: "hidden"
                }}
                ref={provided.innerRef}
                data-testid="list-issue"
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                onClick={() => {
                  issueStore.selectIssue(issue.id); 
                  console.log("This is the issue ="); 
                  console.log(issue); 
                  modalStore.openModal(<NewUpdateIssueForm />)
                }}
              >
                <IssueCardSprintVersion 
                  isBeingDragged={
                    snapshot.isDragging && 
                    !snapshot.isDropAnimating
                  } 
                  style={{overflow: "hidden"}} 
                  >
                  <div style={{
                    bottom: '6px', 
                    display: 'inline-block'
                    }}>{renderSelectedIssueType(issue)}
                  </div>
                  <div 
                    style={{
                      top: '2px', 
                      display: "inline-block", 
                      float: "left", 
                      clear: "both"
                    }}>
                  </div>
                  <IssuePriorityIcon priority={issue.priority} />
                  <div style={{
                    position: 'relative', 
                    top: '50%', 
                    transform: 'translateY(-50%)', 
                    display:  "inline-block", 
                    paddingLeft: '5px', 
                    clear: "both"
                    }}> 
                    <TitleSprintVersion>{issue.name}</TitleSprintVersion>
                  </div>
               
                  <div style={{
                    position: 'relative', 
                    top: '50%', 
                    transform: 'translateY(-50%)',
                    display: "inline-block", 
                    lineHeight: '12px', 
                    float: "right", 
                    clear: "both"
                    }}>
                    <StyledLabel 
                      style={{marginRight: '5px'}} 
                      size='tiny'>{issue.status}
                    </StyledLabel>
                    {
                      issue.assignees.map((assignee, index) => (
                        <AvatarIsActiveLabelBorder 
                          isActive={false} 
                          key={assignee.id} 
                          index={index}
                          >
                          <StyledAvatar 
                            style={{marginRight: '5px'}}
                            value={assignee.id}
                            size='20'
                            src={
                              assignee.photo ? assignee.photo.url : ''
                            } 
                            name={
                              assignee.first_name.concat(' ', assignee.second_name)
                            } 
                            round='20px'
                          />
                        </AvatarIsActiveLabelBorder>
                      ))
                    }
                  </div>
                </IssueCardSprintVersion>
              </div>
          )}
        </Draggable>
      );
})