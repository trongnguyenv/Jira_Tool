import { useHistory } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../stores/store';
import { Sprint } from '../../models/sprint';
import { SprintSection, SprintSectionIssueContainer, Item, ItemText } from './Styles';
import Icon from '../../layout/Icon';
import BetterIcon from '../../layout/BetterIcon';
import SprintDashboardIssue from '../../layout/Lists/List/Issue/SprintDashboardIssue';
import { Droppable } from 'react-beautiful-dnd';
import SprintForm from './form/SprintForm';
import AddDatesToSprintForm from './form/AddDatesToSprintForm';
import ConfirmCloseSprintForm from './form/ConfirmCloseSprintForm';
import NewCreateIssueForm from './form/NewCreateIssueForm';
import moment from 'moment';

interface Props {
    sprint: Sprint;
    index: number;
    sprintDetailsExpanded: boolean[],
    setSprintDetailsExpanded: Function
  }

export default observer(function SprintSectionContainer({ sprint }: Props) {

    const { smallModalStore, modalStore, issueStore } = useStore();
    const { selectSprint, selectedSprint, updateSprint, selectedProject } = issueStore;
    var history = useHistory();

    function handleStartSprint() {
        var current_sprint: Partial<Sprint> = {
            ...selectedSprint!
        }
        delete current_sprint['issues'];
        current_sprint.is_active = true;
        var updated_sprint: any = current_sprint;
        selectedSprint!.is_active = true;
        updateSprint(updated_sprint);
        history.push(`/`);
    }

    function a_sprint_is_currently_active() {
        var currently_active = false;
        selectedProject!.sprints.map(sprint => {
            if(sprint.is_active === true) {
                currently_active = true;
            }
        })
        return(currently_active);
    }
    
    return(
        <Droppable key={sprint.id} droppableId={sprint.id}>
            {
                (provided) => {
                    return (
                        <>
                        <SprintSection sprint_name={sprint.name}>
                        <Item>
                            <BetterIcon 
                                bottom='5' 
                                left='6' 
                                size='24' 
                                code='\032C' 
                            />    
                            <p style={{
                                fontSize: '8x !important', 
                                display: 'relative', 
                                paddingTop: '24px', 
                                paddingLeft: '30px'
                            }}>
                                {sprint.name}
                            
                            {/* Non-backlog sprint (could be active or inactive) */}
                                {/* Add dates to sprint */}
                                {sprint.date_start.toString().substr(0, 4) === "0001" 
                                    && sprint.name !== "Backlog" 
                                    &&
                                        <>
                                            <BetterIcon 
                                                style={{
                                                    bottom: '0px', 
                                                    position: 'relative'
                                                }} 
                                                top='0' 
                                                size='11' 
                                                code='\1F58B' /* Pencil Icon */
                                            />
                                            <div 
                                                onClick={() => { 
                                                    issueStore.selectSprint(sprint.id); 
                                                    modalStore.openModal(<AddDatesToSprintForm />)
                                                    }
                                                } 
                                                style={{
                                                    fontSize: '12px', 
                                                    display: 'inline-block', 
                                                    paddingLeft: '22px'
                                                    }}>
                                                Add dates
                                            </div>

                                        {/* Start sprint if there is no currently active sprint */}
                                        {
                                            a_sprint_is_currently_active() === false &&
                                            <div 
                                                style={{
                                                    cursor: 'not-allowed', 
                                                    fontSize: '12px', 
                                                    float: 'right', 
                                                    display: 'inline-block', 
                                                    marginRight: '20px', 
                                                    paddingLeft: '0px'
                                                    }}>
                                                Start sprint
                                            </div>
                                        }

                                        {/* Complete sprint button (renders only if sprint is active) */}
                                        {
                                            sprint.is_active === true &&
                                            <div 
                                                onClick={() => 
                                                    smallModalStore.openSmallModal(<ConfirmCloseSprintForm />)
                                                } 
                                                style={{
                                                    cursor: 'pointer', 
                                                    fontSize: '12px', 
                                                    float: 'right', 
                                                    display: 'inline-block', 
                                                    marginRight: '20px', 
                                                    paddingLeft: '0px'}}>
                                                Complete sprint
                                            </div>

                                        }         
                                        </>
                                        }
                                    
                                    {/* Display sprint dates (if dates have been added) */}
                                    {sprint.date_start.toString().substr(0, 4) !== "0001" 
                                        && sprint.name !== "Backlog" 
                                        &&
                                    <>
                                        <BetterIcon 
                                            style={{
                                                bottom: '0px', 
                                                position: 'relative'
                                            }} 
                                            top='0' 
                                            size='11' 
                                            code='\1F58B' /* Pencil icon */ 
                                        />
                                        <div 
                                            onClick={() => { 
                                                issueStore.selectSprint(sprint.id); 
                                                modalStore.openModal(<AddDatesToSprintForm />)
                                            }} 
                                            style={{
                                                fontSize: '12px', 
                                                display: 'inline-block', 
                                                paddingLeft: '22px'
                                            }}
                                        >
                                            {
                                                moment(
                                                    sprint.date_start.substr(0, 10)
                                                ).format("MMM Do") 
                                            } -  
                                            {
                                               ' '.concat(moment(
                                                    sprint.date_end.substr(0,10)
                                                ).format("MMM Do"))
                                            } 
                                        </div>

                                        {/* Specify if sprint is active or inactive with a label */}
                                        {
                                            sprint.is_active === true &&
                                                <div 
                                                    style={{
                                                        fontSize: '12px', 
                                                        display: 'inline-block', 
                                                        paddingLeft: '15px'
                                                    }}
                                                >
                                                    Active Sprint
                                                </div>
                                        }
                                        {
                                            !sprint.is_active === true &&
                                            <div 
                                                style={{
                                                    fontSize: '12px', 
                                                    display: 'inline-block', 
                                                    paddingLeft: '15px'
                                                }}
                                            >
                                                Inactive Sprint
                                            </div>
                                        }
                                        {
                                            a_sprint_is_currently_active() === false &&
                                            <div 
                                                onClick={() => {
                                                    selectSprint(sprint.id); 
                                                    handleStartSprint();
                                                }} 
                                                style={{
                                                    fontSize: '12px', 
                                                    float: 'right', 
                                                    display: 'inline-block', 
                                                    marginRight: '20px', 
                                                    paddingLeft: '0px'
                                                }}>
                                                Start sprint
                                            </div>
                                        }
                                        {
                                            sprint.is_active === true &&
                                            <div 
                                                onClick={() => {
                                                    selectSprint(sprint.id); 
                                                    smallModalStore.openSmallModal(<ConfirmCloseSprintForm />)
                                                }} 
                                                style={{
                                                    cursor: 'pointer', 
                                                    fontSize: '12px', 
                                                    float: 'right', 
                                                    display: 'inline-block', 
                                                    marginRight: '20px', 
                                                    paddingLeft: '0px'}}>
                                                Complete sprint
                                            </div>

                                        }
                                    </>
                                }

                                {/* Backlog container */}
                                {sprint.name === "Backlog" &&
                                    <>
                                        <div 
                                            onClick={() => 
                                                smallModalStore.openSmallModal(<SprintForm />)
                                            } 
                                            style={{
                                                fontSize: '12px', 
                                                float: 'right', 
                                                display: 'inline-block', 
                                                marginRight: '20px', 
                                                paddingLeft: '0px'}}>
                                            Create sprint
                                        </div>
                                    </>
                                }
                            </p>
                            
                           
                        </Item>
                        
                        {
                            <SprintSectionIssueContainer   
                                {...provided.droppableProps}
                                ref={provided.innerRef} 
                                style={{
                                    top: '0', 
                                    marginBottom: '0', 
                                    marginLeft: '22px'
                                }}>
                            {
                                sprint.issues
                                    .sort((a, b) => a.sort_order - b.sort_order)
                                    .map( (issue, index) => (
                                        <SprintDashboardIssue 
                                            issue={issue} 
                                            key={issue.id} 
                                            index={index} 
                                        />
                                ))
                            }
                                {provided.placeholder}
                            </SprintSectionIssueContainer>    
                        }
                        <div></div>
                        <Item 
                            onClick={() => 
                                modalStore.openModal(<NewCreateIssueForm />)
                            }>
                            <Icon 
                                left={'11'} 
                                top={'0'} 
                                type='plus' 
                                size='14' 
                            />
                            <ItemText 
                                style={{
                                    paddingLeft: '36px', 
                                    bottom: '4px'
                                }}>
                                Create issue
                            </ItemText>
                        </Item>
                        </SprintSection>
                        <br/>
                    </>
                    )
                }
            }
        </Droppable>
    )
});


