import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import _ from 'lodash';
import {observer} from 'mobx-react-lite';
import shmirastack from './Shmira Stack.png';
import { Grid } from 'semantic-ui-react';
import BetterIcon from './BetterIcon/index';
import Icon from '../shared/components/Icon';
import IssueTypeIcon from './IssueTypeIcon';
import LinkedInProfile from './LinkedInProfile.jpeg';
import Avatar from 'react-avatar';


export default observer(function AboutPage() {
    return (
        <Grid>
            <Grid.Column width={1}></Grid.Column>
            <Grid.Column width={8}>
                <h3>About Shmira</h3>
                <p>
                    Shmira is a personal project by me, Davide Lorino.
                    <br/><br/>
                    Shmira is a Jira clone that aims to provide many of the features found in popular project management tools.
                    <br/><br/> 
                    I made this because other Jira clones that I found were mainly just portfolio projects made to showcase the developers UI skills, but they lacked the range of features necessary for someone to manage their projects using that tool.
                </p>
                    <h3>Core Features</h3>
                
                    <div style={{ display: 'inline-block'}}>
                        <IssueTypeIcon color='#65BA43 !important'type='task' size={15} />
                        <div style={{marginLeft: '5px', display: 'inline-block'}}>
                            <h4>User login and authentication</h4>
                        </div> 
                    </div>
                    <br/><br/>
                    <p>Shmira supports any number of users implements a complete authentication system leveraging Microsoft Entity Framework and Microsoft Identity Services.</p>
                    
                    <div style={{ display: 'inline-block'}}>
                        <IssueTypeIcon color='#65BA43'type='task' size={15} />
                        <div style={{marginLeft: '5px', display: 'inline-block'}}>
                            <h4>Backend-Frontend data consistency</h4>
                        </div> 
                    </div>
                    <br/><br/>
                    <p>Other implementations I have found basically cut this corner and instead opt for a pre-loaded state that lives exclusively in the front end. Shmira handles reads and writes to a relational database so that you can persist your data.</p>
                    
                    <div style={{ display: 'inline-block'}}>
                        <IssueTypeIcon color='#65BA43'type='task' size={15} />
                        <div style={{marginLeft: '5px', display: 'inline-block'}}>
                            <h4>Unlimited number of projects</h4>
                        </div> 
                    </div>
                    <br/><br/>
                    <p>This ties in with the previous point about persisting data. Shmira allows you to determine how many projects you want to manage rather than just preloading one temp project into the apps frontend state.</p>

                    <div style={{ display: 'inline-block'}}>
                        <IssueTypeIcon color='#65BA43'type='task' size={15} />
                        <div style={{marginLeft: '5px', display: 'inline-block'}}>
                            <h4>Sprints & Backlog System</h4>
                        </div> 
                    </div>
                    <br/><br/>
                    <p>I have not found another Jira clone that implements this feature. All projects have a backlog, sprints can be created, started, stopped and closed. Shmira also offers both a sprint and a kanban view of your projects.</p>
                    
                    <div style={{ display: 'inline-block'}}>
                        <IssueTypeIcon color='#65BA43'type='task' size={15} />
                        <div style={{marginLeft: '5px', display: 'inline-block'}}>
                            <h4>Invite Collaborators</h4>
                        </div> 
                    </div>
                    <br/><br/>
                    <p>This feature supports both registered and unregistered users. Unregistered collaborators receive an email invitation to sign up and collaborate on your project. Upon registration, invited users have the ability to work on your project. This page is currently showing the demo version which will grant users the ability to invite collaborators however in order for those invitations to be accepted I need to be the final approver.</p>

                    <div style={{ display: 'inline-block'}}>
                        <IssueTypeIcon color='#65BA43'type='task' size={15} />
                        <div style={{marginLeft: '5px', display: 'inline-block'}}>
                            <h4>Time logging + progress tracking</h4>
                        </div> 
                    </div>
                    <br/><br/>
                    <p>Log time, update estimates and view a summary of progress & time remaining.</p>

                    <div style={{ display: 'inline-block'}}>
                        <IssueTypeIcon color='#65BA43'type='task' size={15} />
                        <div style={{marginLeft: '5px', display: 'inline-block'}}>
                            <h4>User profile editing</h4>
                        </div> 
                    </div>
                    <br/><br/>
                    <p>Update personal details + image upload, crop and resize</p>
                    
                   
            </Grid.Column>
            <Grid.Column width={7}>
                <img style={{maxWidth: '100%', maxHeight: '100%', overflow: 'hidden'}} src={shmirastack} />
                <h3>Stack and Design</h3>
                <p>Shmira has a relatively minimal tech footprint in terms of the stack. C# / .Net Core 6 on the backend, React and Typescript on the front end and Postgresql for the database. For the more technical details about architecture and design, have a look at the README on the repo. At a very high level, Shmira was made following the clean architecture philosophy, CQRS, and the API implements the mediator design pattern.</p>
                
                <h3>About Me</h3>
                    
                
                
                <p>I'm a 30 year old freelance developer in Sydney, Australia. I do a mix of consulting in both software development and data analysis. I check my email regularly so feel free to reach out at davelorino@gmail.com or on <a href='https://www.linkedin.com/in/davide-lorino-73963686/'>LinkedIn</a></p>
                <div style={{marginTop: '30px', display: 'flex', justifyContent: 'center'}}>
                    <Avatar style={{marginLeft: '10px', display: 'flex'}} size='100' round='100px' src={require('./linkedinprofile.jpeg')} />
                </div>
                
            </Grid.Column>
        </Grid>
    )
})