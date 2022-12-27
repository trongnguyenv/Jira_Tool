import React, {useState} from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { Project } from '../../../models/project';
import { Issue } from '../../../models/issue';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../../stores/store';
import ProjectBoardListIssue from './Issue/ProjectDashboardIssue';
import { List, Title, Issues } from './Styles';

interface Props {
  status: string;
  sprint_id: string;
  project: Project;
  issues: Issue[];
}

export default observer(function ProjectBoardList({status, project, sprint_id, issues}: Props) {
  
  const { issueStore } = useStore();
  
  var status_name = status.substring(0, status.indexOf('-'));

  return (
    <Droppable key={status} droppableId={status}>
      { (provided) => {
        return(
          <List>
            <div style={{display: 'inline-block'}}>
              <Title style={{display: 'inline-block'}}>
                {status_name}
              </Title>
              <Title style={{
                float: 'right', 
                marginRight: '2px', 
                display: 'inline-block'
                }}>
                {issueStore.selectedProject!.sprints
                  .find(sprint => 
                    sprint.is_active === true
                  )!.issues.filter(issue => 
                      issue.status === status_name
                  )!.length
                }
              </Title>
            </div>
            <Issues
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {issues
                .sort((a, b) => a.sort_order - b.sort_order)
                .map((issue, index) => (
                    <ProjectBoardListIssue 
                      key={issue.id} 
                      issue={issue} 
                      index={index}  
                      />
                ))
              }
            { provided.placeholder }
            </Issues>
          </List>
        )
      }}
    </Droppable>
  );
});


