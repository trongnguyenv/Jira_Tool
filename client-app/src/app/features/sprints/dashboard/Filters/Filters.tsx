import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Assignee } from '../../../../models/assignee';
import { Project } from '../../../../models/project';
import { useStore } from '../../../../stores/store';
import { observer } from 'mobx-react-lite';
import { Input } from 'semantic-ui-react';
import { StyledAvatar, AvatarIsActiveBorder } from './Styles';
import { FaChartLine } from 'react-icons/fa';

export default observer(function ProjectBoardFilters() {
  const { userStore, issueStore, commonStore } = useStore();
  const { selectedProject, filterProject, activeUsers, updateActiveUsers } = issueStore;
  const history = useHistory();


    const handleClick = (selectedProject: Project, user: Assignee) => {
      var user_ids_selected: string[] = [];
      selectedProject.assignees.forEach(function(obj) {
        if(obj.id === user.id) {
          user_ids_selected.push(user.id)
        }
      })
      updateActiveUsers(user_ids_selected);  
      filterProject();
    };


    function clearAllFilters() {
      issueStore.activeUsers = [];
      issueStore.searchFilter = "";
      issueStore.filterProject();
    }

    function filterOnlyMyIssues() {
      issueStore.activeUsers = [selectedProject!.assignees
        .find(assignee => 
          assignee.id_app_user === commonStore.account_id
        )!.id];
      issueStore.filterProject();
    }

    function handleSearchFilterChange(value: any) {
      issueStore.searchFilter = value;
      issueStore.filterProject();
    }

    
    if(selectedProject == undefined) return null
    
  return (
    <div style={{paddingBottom: '20px'}}>
      <Input
        style={{marginLeft: '10px', marginRight: '20px'}}
        size="mini"
        icon="search"
        placeholder="Search for issues..."
        onChange={(e) => handleSearchFilterChange(e.target.value)}
      />
      {   
        selectedProject.assignees.map( (user, index) => (
          <AvatarIsActiveBorder 
            isActive={activeUsers.includes(user.id)} 
            index={index * (-index)} 
            >
            <StyledAvatar 
              value={user.id}
              onClick={() => 
                handleClick(selectedProject, user)
              }
              size='30'
              src={user.photo ? user.photo.url : ''} 
              name={user.first_name.concat(' ', user.second_name)} 
              round='20px'
            />
          </AvatarIsActiveBorder>
        ))
      }
      <div 
        style={{
          cursor: 'pointer', 
          color: '#deebff', 
          marginLeft: '30px', 
          alignItems: 'center', 
          paddingTop: '15px', 
          display: 'inline-block'
        }}
        onClick={() => filterOnlyMyIssues()}
      > 
        <p>Only my issues</p> 
      </div>
      <div 
        style={{
          cursor: 'pointer', 
          color: '#deebff', 
          marginLeft: '15px', 
          alignItems: 'center', 
          paddingTop: '15px', 
          display: 'inline-block'
        }}
        onClick={() => clearAllFilters()}
      >  
        <p>Clear all</p> 
      </div>
      <div 
        onClick={() => history.push('/insights')} 
        style={{
          marginTop: '18px', 
          marginRight: '10px', 
          float: 'right', 
          display: 'inline-block'
        }}>
        <p style={{
          cursor: 'pointer', 
          color: '#deebff', 
          float: 'right', 
          bottom: '5px', 
          marginRight: '8px', 
          marginBottom: '5px', 
          marginLeft: '5px', 
          display: 'inline-block'
          }}>Insights
        </p>         
        <FaChartLine 
          size='18' 
          style={{
            cursor: 'pointer', 
            color: '#deebff', 
            float: 'right', 
            top: '10px', 
            display: 'inline-block', 
            paddingBottom: '0px', 
            marginBottom: '0px', 
            bottom: '0px' 
          }}/>
        </div>
      </div>
  );
});


