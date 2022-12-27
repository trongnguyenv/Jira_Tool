import React, { useEffect, useState } from 'react';
import {useStore} from '../../../stores/store';
import {observer} from 'mobx-react-lite';
import IssueLists from '../../../layout/Lists/IssueLists';
import IssueListsNoActiveSprint from '../../../layout/Lists/IssueListsNoActiveSprint';
import {DragDropContext, DropResult} from 'react-beautiful-dnd';
import Filters from './Filters/Filters';
import _, { concat } from 'lodash';
import moment from 'moment';
import '../../../../darkmode.css';



export default observer(function IssuesDashboard() {

    const { issueStore } = useStore();
    const {selectedProject,
           issuesByDate,
           updateIssueAndSprint
        } = issueStore;

    const isPositionChanged = (destination: any, source: any) => {
    if (!destination) return false;
    const isSameList = destination.droppableId === source.droppableId;
    const isSamePosition = destination.index === source.index;
    return !isSameList || !isSamePosition;
    }


    const getDaysRemaining = () => {
        var date_end = moment(
            selectedProject!.sprints
                .find(sprint => sprint.is_active)!
                .date_end);
        return concat(
            moment(date_end).diff(moment(), 'days').toString(), 
            " days remaining"
        );
    }

    const handleIssueDrop = ({destination, source, draggableId}: DropResult) => {
        if (!isPositionChanged(source, destination)) return;

        var source_sprint_name = source!.droppableId
            .substring(
                source!.droppableId.indexOf('-') + 1, 
                source!.droppableId.length
            );

        var destination_status_name = destination!.droppableId
            .substring(
                0, destination!.droppableId.indexOf('-')
            );

        var destination_sprint_name = destination!.droppableId
            .substring(
                destination!.droppableId.indexOf('-') + 1, 
                destination!.droppableId.length
            );

        var source_sprint = selectedProject?.sprints
            .find(sprint => sprint.name === source_sprint_name);

        var source_sprint_id = source_sprint!.id;
        
        var destination_sprint = selectedProject?.sprints
            .find(sprint => sprint.name === destination_sprint_name);

        var destination_sprint_id = destination_sprint!.id;
        
        const issue_id = draggableId;

        var issueToUpdate = issuesByDate
            .find(issue => issue.id.toLowerCase() === issue_id.toLowerCase());

        var source_status_name = issueToUpdate!.status;

        var number_of_todo = 0;
        var number_of_inprogress = 0;
        var number_of_review = 0;

        selectedProject!.sprints
            .filter(sprint => sprint.name === destination_sprint_name)
            .map(sprint => {

                number_of_todo = sprint.issues
                    .filter(issue => issue.status == "To Do")
                    .length;

                number_of_inprogress = sprint.issues
                    .filter(issue => issue.status == "In Progress")
                    .length;

                number_of_review = sprint.issues
                    .filter(issue => issue.status == "Review")
                    .length;

            if(number_of_todo > 0 && issueToUpdate!.status == "To Do"){
                number_of_todo = number_of_todo - 1;
            }
            if(number_of_inprogress > 0 && issueToUpdate!.status == "In Progress"){
                number_of_inprogress = number_of_inprogress - 1;
            }
            if(number_of_review > 0 && issueToUpdate!.status == "Review"){
                number_of_review = number_of_review - 1;
            }
        })

        
        
        issueToUpdate!.status = destination_status_name;


        if(issueToUpdate!.status == "To Do"){
            issueToUpdate!.sort_order = destination!.index;
        }

        if(issueToUpdate!.status == "In Progress"){
            issueToUpdate!.sort_order = 
                parseInt('20'.concat((
                    destination!.index + 
                    number_of_todo).toString()));
        }

        if(issueToUpdate!.status == "Review"){
            issueToUpdate!.sort_order = 
                parseInt('300'.concat((
                    destination!.index + 
                    number_of_todo + 
                    number_of_inprogress).toString()));
        }
        if(issueToUpdate!.status == "Done"){
            if(source_status_name == "Done"){
                if(destination!.index > source.index){
                    issueToUpdate!.sort_order = 
                        parseInt('4000'.concat((
                            destination!.index + 
                            number_of_todo + 
                            number_of_inprogress + 
                            number_of_review).toString())) + 1;
                } 
                
                else {
                    issueToUpdate!.sort_order = 
                        parseInt('4000'.concat((
                            destination!.index + 
                            number_of_todo + 
                            number_of_inprogress + 
                            number_of_review).toString()));
                }
            } 
            
            else {
                issueToUpdate!.sort_order = 
                    parseInt('4000'.concat((
                        destination!.index + 
                        number_of_todo + 
                        number_of_inprogress + 
                        number_of_review).toString())) + 1;
            }
            
        }

        var issuesToUpdate: any[] = [];

        selectedProject!.sprints.map(sprint => {
            
            // Take out of source sprint
            if(sprint.name === source_sprint_name){
               sprint.issues = sprint.issues.filter(issue => 
                    issue.id.toLowerCase() !== issue_id.toLowerCase())
                    .sort((a, b) => b.sort_order - b.sort_order)
            }
            
            // Insert into destination sprint
            if(sprint.name === destination_sprint_name){
                
                /* Useful logger for debugging sorting of issues
                sprint.issues
                    .sort((a, b) => a.sort_order - b.sort_order)
                    .map((issue, index) => {
                        console.log(issue.name.concat(' index = ', index.toString()));
                })
                */

                var splice_index = 0;
                if(issueToUpdate!.status == "To Do"){
                    splice_index = destination!.index;
                }
                if(issueToUpdate!.status == "In Progress"){
                    splice_index = destination!.index + (number_of_todo);
                }
                if(issueToUpdate!.status == "Review"){
                    splice_index = destination!.index + 
                        (number_of_todo) + 
                        (number_of_inprogress);
                }
                if(issueToUpdate!.status == "Done"){
                    splice_index = destination!.index + 
                        (number_of_todo - 1) + 
                        (number_of_inprogress) + 
                        (number_of_review);
                }

                sprint.issues
                    .sort((a,b) => a.sort_order - b.sort_order)
                    .splice(splice_index, 0, issueToUpdate!);
                
                sprint.issues
                    .sort((a,b) => a.sort_order - b.sort_order)
                    .map((issue, index) => {
                    
                    if(issue.status == "To Do"){
                        issue.sort_order = index;
                    }
                    if(issue.status == "In Progress"){
                        issue.sort_order = parseInt('20'.concat(index.toString()));
                    }
                    if(issue.status == "Review"){
                        issue.sort_order = parseInt('300'.concat(index.toString()));
                    }
                    if(issue.status == "Done"){
                        issue.sort_order = parseInt('4000'.concat(index.toString()));
                    }
                    
                })
                
                issuesToUpdate = _.cloneDeep(sprint.issues);

            }
        }); 

        issuesToUpdate.map(issue => {
           delete issue['assignees']
           delete issue['comments']
        })        

        if(destination_sprint_name === source_sprint_name){
            issueStore.updateIssues(issuesToUpdate);
        } else {
            updateIssueAndSprint(
                source_sprint_id,
                destination_sprint_id,
                issueToUpdate!.name,
                issueToUpdate!.id,
                issueToUpdate!
                );
        }
    
      };

    return(
        <div>
            <DragDropContext onDragEnd={handleIssueDrop}>
                <Filters />
                {selectedProject?.sprints
                    .filter(sprint => sprint.is_active === true)
                    .map(sprint => (
                        <div key={sprint.id} style={{marginLeft: 40}}>
                            <div key={sprint.id}>

                                {/* Sprint name */}
                                <div 
                                    style={{
                                        marginLeft: '10px', 
                                        display: 'inline-block'}}> 
                                        {sprint.name}
                                </div> 

                                {/* Date 'from' and 'to' of sprint */}
                                <div 
                                    style ={{
                                        fontSize: '13px', 
                                        paddingLeft: '20px', 
                                        display: 'inline-block', 
                                        color: "grey"
                                    }}>
                                    {
                                        moment(sprint.date_start.substr(0, 10)).format("MMM Do").concat(' - ')
                                    } 
                                    {
                                        moment(sprint.date_end.substr(0, 10)).format("MMM Do")    
                                    }
                                </div>

                                {/* Days remaining in sprint */}
                                <div 
                                    style={{
                                        marginRight: '20px', 
                                        display: 'inline-block', 
                                        float: 'right', 
                                        fontSize: '13px', 
                                        color: 'grey'
                                    }}>
                                    {getDaysRemaining()}
                                </div>
                                <IssueLists 
                                    sprint={sprint} 
                                    key={sprint.id}
                                />
                            </div>
                        </div>
                ))}

                {/* If there are no active sprints, render the 'no active sprints' board */}
                {
                    selectedProject?.sprints
                        .filter(sprint => sprint.is_active === true)
                        .length === 0 &&
                    <IssueListsNoActiveSprint />
                }
            </DragDropContext>
        </div>
    )
})