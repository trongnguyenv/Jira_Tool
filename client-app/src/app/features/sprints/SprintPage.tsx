import React, {useEffect, useState} from 'react';
import { SprintSectionBacklog } from './Styles';
import { observer } from 'mobx-react-lite';
import Filters from '../sprints/dashboard/Filters/Filters';
import { useStore } from '../../stores/store';
import SprintSectionContainer from './SprintSectionContainer';
import {DragDropContext, DropResult} from 'react-beautiful-dnd';
import _ from 'lodash';

export default observer(function SprintPage() {

    const { issueStore } = useStore();
    const { issuesByDate, selectedProject, updateIssues, updateIssueAndSprint } = issueStore;
    var [sprintDetailsExpanded, setSprintDetailsExpanded] = useState<Array<boolean>>([]);

    useEffect(() => {
        var initialDetailsExpandedArray: boolean[] = [];
        selectedProject!.sprints.map((sprint, index) => {
            initialDetailsExpandedArray.push(true);
        })
        setSprintDetailsExpanded(initialDetailsExpandedArray)}
    , [])
    
    const isPositionChanged = (destination: any, source: any) => {
        if (!destination) return false;
        
        const isSameList = destination.droppableId === source.droppableId;
        const isSamePosition = destination.index === source.index;
        
        return !isSameList || !isSamePosition;
    };

    const handleIssueDrop = ({destination, source, draggableId}: DropResult) => {
    
        if (!isPositionChanged(source, destination)) return;

        var source_sprint_id = source!.droppableId
        var destination_sprint_id = destination!.droppableId
        
        var destination_sprint = selectedProject?.sprints.find(sprint => sprint.id === destination_sprint_id);
        var destination_sprint_id = destination_sprint!.id;
        
        const issue_id = draggableId;

        var issueToUpdate = issuesByDate.find(issue => issue.id.toLowerCase() === issue_id.toLowerCase());

        var number_of_todo = 0;
        var number_of_inprogress = 0;
        var number_of_review = 0;

        selectedProject!.sprints.filter(sprint => sprint.id === destination_sprint_id).map(sprint => {
            number_of_todo = sprint.issues.filter(issue => issue.status == "To Do").length;
            number_of_inprogress = sprint.issues.filter(issue => issue.status == "In Progress").length;
            number_of_review = sprint.issues.filter(issue => issue.status == "Review").length;

            if(number_of_todo > 0){
                number_of_todo = number_of_todo - 1;
            }
            if(number_of_inprogress > 0){
                number_of_inprogress = number_of_inprogress - 1;
            }
            if(number_of_review > 0){
                number_of_review = number_of_review - 1;
            }
        })
        
        
        if(issueToUpdate!.status == "To Do"){
            issueToUpdate!.sort_order = destination!.index;
        }
        if(issueToUpdate!.status == "In Progress"){
            issueToUpdate!.sort_order = parseInt('20'.concat(
                (destination!.index + number_of_todo).toString()
            ));
        }
        if(issueToUpdate!.status == "Review"){
            issueToUpdate!.sort_order = parseInt('300'.concat(
                (destination!.index + number_of_todo + number_of_inprogress).toString()
            ));
        }
        if(issueToUpdate!.status == "Done"){
            issueToUpdate!.sort_order = 
                parseInt('4000'.concat(
                    (destination!.index + number_of_todo + number_of_inprogress + number_of_review).toString()
            ));
        }

        var issuesToUpdate: any[] = [];

        selectedProject!.sprints.map(sprint => {
            // Take out of source sprint
            
            if(sprint.id === source_sprint_id){
               sprint.issues = sprint.issues
                                .filter(issue => issue.id.toLowerCase() !== issue_id.toLowerCase())
                                .sort((a, b) => b.sort_order - a.sort_order)
            }
            
            // Insert into destination sprint
            if(sprint.id === destination_sprint_id){
                
                sprint.issues.sort((a, b) => a.sort_order - b.sort_order).map((issue, index) => {
                    console.log(issue.name.concat(' index = ', index.toString()));
                })
                var splice_index = 0;
                if(issueToUpdate!.status == "To Do"){
                    splice_index = destination!.index;
                }
                if(issueToUpdate!.status == "In Progress"){
                    splice_index = destination!.index + (number_of_todo);
                }
                if(issueToUpdate!.status == "Review"){
                    splice_index = destination!.index + (number_of_todo) + (number_of_inprogress);
                }
                if(issueToUpdate!.status == "Done"){
                    splice_index = destination!.index + (number_of_todo - 1) + (number_of_inprogress) + (number_of_review);
                }
                sprint.issues.sort((a,b) => a.sort_order - b.sort_order).splice(splice_index, 0, issueToUpdate!);
                
                sprint.issues.sort((a,b) => a.sort_order - b.sort_order).map((issue, index) => {
                    
                    console.log(issue.name.concat(' index = ', index.toString()));
                    
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

        if(destination_sprint_id === source_sprint_id){
            updateIssues(issuesToUpdate);
        } else {
            var issueToUpdateSanitized: any = {
                ...issueToUpdate
            }
            delete issueToUpdateSanitized['assignees'];
            delete issueToUpdateSanitized['comments'];
            updateIssueAndSprint(
                source_sprint_id,
                destination_sprint_id,
                issueToUpdate!.name,
                issueToUpdate!.id,
                issueToUpdateSanitized!
                );
        }
    };

    return(
        <>
            <DragDropContext onDragEnd={handleIssueDrop}>
                <Filters />
                {
                    selectedProject!.sprints
                        .filter(sprint => sprint.name !== "Backlog" && sprint.is_active)
                        .map( (sprint, index) => (
                            <SprintSectionContainer 
                                sprintDetailsExpanded={sprintDetailsExpanded} 
                                setSprintDetailsExpanded={setSprintDetailsExpanded} 
                                sprint={sprint} 
                                key={index} 
                                index={index} 
                            />
                        ))
                }
                {
                    selectedProject!.sprints
                        .filter(sprint => sprint.name !== "Backlog" && !sprint.is_active)
                        .map( (sprint, index) => (
                        <SprintSectionContainer 
                            sprintDetailsExpanded={sprintDetailsExpanded} 
                            setSprintDetailsExpanded={setSprintDetailsExpanded} 
                            sprint={sprint} 
                            key={index} 
                            index={index} 
                        />
                    ))
                }   
                {
                    selectedProject!.sprints
                        .filter(sprint => sprint.name === "Backlog")
                        .map( (sprint, index) => (
                            <>
                                <SprintSectionBacklog> 
                                    <div> 
                                            {
                                                sprint.issues.length === 0 && 
                                                <SprintSectionContainer 
                                                    sprint={sprint} 
                                                    index={index} 
                                                    sprintDetailsExpanded={sprintDetailsExpanded} 
                                                    setSprintDetailsExpanded={setSprintDetailsExpanded}>
                                                    
                                                    <div style={{color: '#FFFFFF !important'}}> 
                                                        Your backlog is empty. 
                                                    </div>
                                                    
                                                </SprintSectionContainer>
                                            }
                                            {
                                                sprint.issues.length > 0 && 
                                                <div 
                                                    style={{
                                                        right: '20px', 
                                                        marginLeft: '0px'
                                                    }}>
                                                    <SprintSectionContainer 
                                                        sprintDetailsExpanded={sprintDetailsExpanded} 
                                                        setSprintDetailsExpanded={setSprintDetailsExpanded} 
                                                        sprint={sprint} 
                                                        key={index} 
                                                        index={index} 
                                                    />
                                                </div>
                                            }
                                    </div>
                                </SprintSectionBacklog>
                            </>
                        )
                    )
                }
            </DragDropContext>
        </>
    )
});
