import React from 'react';
import { observer } from 'mobx-react-lite';
import List from './List/IssueList';
import { Lists } from './Styles';
import { useStore } from '../../stores/store';
import { Sprint } from '../../models/sprint';

interface Props {
  sprint: Sprint;
}

export default observer(function ProjectBoardLists({sprint}: Props) {

  const {issueStore} = useStore();
  const { selectedProject } = issueStore;
  var issue_status = ['To Do', 'In Progress', 'Review', 'Done']
  var sprint_status = issue_status.map(status => (status.concat("-", sprint.name) ))

  return (
      <Lists>
        {sprint_status.map(status => (
          <List
            key={status}
            sprint_id={sprint.id}
            project={selectedProject!}
            issues={sprint.issues
              .filter(issue => 
                issue.status === status.substring(0, status.indexOf('-'))
              )
            }
            status={status}
          />
        ))}
      </Lists>
  );
});



