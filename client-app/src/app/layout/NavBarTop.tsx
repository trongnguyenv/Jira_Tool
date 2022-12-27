import React, { Component, useEffect, useLayoutEffect } from 'react'
import { Input, Menu, Dropdown, Button } from 'semantic-ui-react'
import Avatar from 'react-avatar';
import { runInAction } from 'mobx';
import { Project } from '../models/project';
import { Assignee } from '../models/assignee';
import Icon from './Icon'
import styled from 'styled-components'
import {useStore} from '../stores/store';
import {observer} from 'mobx-react-lite';
import NewCreateIssueForm from '../features/sprints/form/NewCreateIssueForm';
import EditProfileForm from '../features/sprints/form/EditProfileForm';
import InviteCollaboratorForm from '../features/sprints/form/InviteCollaborator';
import ProjectForm from '../features/sprints/form/ProjectForm';
import InviteConfirmationForm from '../features/sprints/form/InviteConfirmationForm';
import { v4 as uuid } from 'uuid';
import { toast } from 'react-toastify';
import _ from 'lodash';
import { useHistory } from 'react-router-dom';

const Item = styled.div`
      position: relative;
      //width: 100%;
      height: 42px;
      line-height: 42px;
      padding-left: 0px;
      color: #deebff;
      transition: color 0.1s;
      i {
        position: absolute;
        left: 37px;
      }
    `;

const FirstItem = styled.div`
    position: relative;
    //width: 100%;
    height: 42px;
    line-height: 42px;
    padding-left: 0px;
    color: #deebff;
    transition: color 0.1s;
    i {
      position: absolute;
      left: 20px;
    }
`;

const StyledDropdownItem = styled(Dropdown.Item)`
  width: 100%;
  height: 20px;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
  line-height: 20px;
  padding-left: 16px;
  transition: color 0.1s;
  &:hover {
    backdrop-filter: brightness(1.5) !important;
  }
  i {
    position: absolute;
    left: 18px;
  }
`;


    
    const ItemText = styled.div`
      position: relative;
      right: 0;
      visibility: visible;
      opacity: 1;
      padding-left: 47px;
      padding-right: 10px;
      color: grey;
      //text-transform: uppercase;
      //transition: all 0.1s;
      //transition-property: right, visibility, opacity;
    `;






const NavBarTop = () => {
  const {issueStore, modalStore, smallModalStore, mediumModalStore, commonStore, accountStore} = useStore();
  const {allProjects, selectProject} = issueStore;
  const { allInvites } = accountStore;
  const history = useHistory();



function renderInviteNotification() {
  if(allInvites!.filter(invite => invite.invitee_account_email === commonStore.email).length > 0){
    toast(<div onClick={() => modalStore.openModal(<InviteConfirmationForm />)} style={{display: 'inline'}}> <p>You have an invitation to join a project.<a> Click here </a>to see your invite.</p></div> , {
      position: "bottom-right",
      hideProgressBar: false,
      autoClose: false,
      toastId: '4',
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined
  })
  }
}

function handleLogout () {
    accountStore.logout();
}


function addProjectIdToLegacyTickets() {
  issueStore.selectedProject!.sprints.find(sprint => sprint.is_active === true)!
    .issues.map(issue => {
      issue.project_id = issueStore.selectedProject!.id;
    });
    var issues_to_send: any[] = _.cloneDeep(issueStore.selectedProject!.sprints.find(sprint => sprint.is_active !== true)!.issues);
    issues_to_send.map(issue => {
      delete issue['assignees'];
    })
    
    issueStore.updateIssues(issues_to_send);
  }
  



  function renderProjectOptions(allProjects: Project[]) {
    var projectOptionsArray: any[] = [];

    var new_uuid = uuid();

    var createNewProjectOptions = {
      key: new_uuid,
      value: new_uuid,
      text: 'Create a new project',
      content: (
        <>
        <StyledDropdownItem onClick={() => mediumModalStore.openMediumModal(<ProjectForm />)}>
          <Icon style={{marginRight: '0px'}} type='plus' /><ItemText style={{paddingLeft: '18px'}}>Create a new project</ItemText>
        </StyledDropdownItem>
        <Dropdown.Divider size='large'/>
        </>
      )
    }

  
    
    projectOptionsArray.push(createNewProjectOptions);

      allProjects!.map( (project, index) => {
        if(project.assignees.filter(assignee => assignee.id === commonStore.assignee_id).length > 0){
          var option_obj = {
            key: project.id,
            value: project.id,
            text: project.name,
            content: ( 
                        <StyledDropdownItem onClick={() => selectProject(project.id)}>
                          {project.name}
                        </StyledDropdownItem>
            )
          }
          projectOptionsArray.push(option_obj);
        }
        
      })
      return(projectOptionsArray);
  }




      return (
        <Menu fixed='top' primary>
         <FirstItem style={{cursor: "pointer"}}>
          <a onClick={() => mediumModalStore.openMediumModal(<ProjectForm />) }>
            <Icon type="duck" size={'18'} ></Icon>
          
            <ItemText>Shmira Software</ItemText>
          </a>
         </FirstItem>
           <Dropdown 
            style={{marginTop: '12px', marginLeft: '5px'}}
            size='small'
            text ='Projects'
            font-size = '10px'
            options={renderProjectOptions(allProjects)}
            >
            </Dropdown>
           <Dropdown 
            style={{marginTop: '12px', marginLeft: '15px', marginRight: '15px'}}
            text ='People'
            font-size = '10px'
            >
            <Dropdown.Menu>
                    <Dropdown.Item onClick={() => smallModalStore.openSmallModal(<InviteCollaboratorForm />)} style={{ hover:{backdropFilter: "brightness(120%)"}, filter: "brightness(120%)",}}>
                      + Invite someone to collaborate
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown> 
          <Item>
          <Button
              onClick={() => {issueStore.cancelSelectedIssue(); modalStore.openModal(<NewCreateIssueForm />)  }}//}
              size='mini'
              color='blue'
              content='Create'
              
            />
            </Item>
            
          <Menu.Menu position='right'>
          
            <Item>
              <Button
                onClick={() => {handleLogout();}}//}
                size='mini'
                color='blue'
                content='Log Out'
                
              />
            </Item>
            <Menu.Item>
              <Input icon='search' placeholder='Search...' />
            </Menu.Item>

            
              <Avatar onClick={() => {modalStore.openModal(<EditProfileForm />)}}
                      style={{marginTop: '7px', marginRight: '10px', cursor: "pointer"}} 
                      size="30" round="30px"
                      
                      src={
                        issueStore.selectedProject!.assignees.find((assignee: Assignee) => assignee.id_app_user === commonStore.account_id)!.photo ? 
                        issueStore.selectedProject!.assignees.find((assignee: Assignee) => assignee.id_app_user === commonStore.account_id)!.photo.url : ''}
                      name={accountStore.allAccounts.find(account => account.id === commonStore.account_id)!.first_name.concat(' ', accountStore.allAccounts.find(account => account.id === commonStore.account_id)!.second_name)}
                      
                      />
            
             
              {allInvites
                  .filter(invite => invite.invitation_status === "Pending")
                  .filter(invite => invite.invitee_account_email !== null)
                  .filter(invite => invite.invitee_account_email.toLowerCase() === commonStore.email!.toLowerCase()).length > 0 &&
                    renderInviteNotification()
                }
               
            
            
          </Menu.Menu>
        </Menu>
      )
}

export default observer(NavBarTop);
  