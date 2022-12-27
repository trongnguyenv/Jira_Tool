import React from 'react';
import { observer } from 'mobx-react-lite';
import ListNoActiveSprint from './List/IssueListNoActiveSprint';
import { Lists } from './Styles';

export default observer(function ProjectBoardListsNoActiveSprint() {
  
  var issue_status = ['To Do', 'In Progress', 'Review', 'Done']

  return (
      <Lists>
        {issue_status.map(status => (
          <ListNoActiveSprint
            key={status}
            status={status}
          />
        ))}
      </Lists>
  );
});