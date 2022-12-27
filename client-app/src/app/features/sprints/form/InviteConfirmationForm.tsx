import React, { useState, useEffect, useRef } from 'react';
import { Segment, Button, Input, Table} from 'semantic-ui-react';
import { Formik, Form, ErrorMessage, Field } from 'formik';
import { useStore } from '../../../stores/store';
import { observer } from 'mobx-react-lite';
import * as Yup from 'yup';
import  "react-quill/dist/quill.snow.css";
import "./login/login.css";
import Icon from '../../../layout/Icon';
import { AccountFormValues } from '../../../models/account';
import { Invitation } from '../../../models/invitation';
import { isRegularExpressionLiteral } from 'typescript';
import { v4 as uuid } from 'uuid';


export default observer(function InviteConfirmationForm() {

    const { accountStore, issueStore, commonStore } = useStore();

    return (
        <div className='darkreader' style={{backgroundColor: 'transparent'}}>
                    <div style={{width: '100%', minHeight: '200px',
                                backgroundColor: 'transparent',
                                display: 'flex', flexWrap: 'wrap', justifyContent: 'left',
                                padding: '15px', backgroundRepeat: 'no-repeat', backgroundPosition: 'center',
                                backgroundSize: 'cover', position: 'relative', zIndex: '1'}}>
                        <div style={{paddingTop: '0px', width: '100%', display: 'flex', flexWrap: 'wrap', justifyContent: 'center'}} >
                            <Icon top={0} type='duck' size={40} />
                        </div>
                        <h2 style={{marginTop: '5px'}}>Project Invites</h2>
                        <div style={{width: '100%', minHeight: '200px',
                                backgroundColor: 'transparent',
                                display: 'flex', flexWrap: 'wrap', justifyContent: 'left',
                                padding: '15px', backgroundRepeat: 'no-repeat', backgroundPosition: 'center',
                                backgroundSize: 'cover', position: 'relative', zIndex: '1'}}>
                            <Table basic='very' celled collapsing>
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.HeaderCell>Project</Table.HeaderCell>
                                            <Table.HeaderCell>Invited By</Table.HeaderCell>
                                            <Table.HeaderCell>Project Description</Table.HeaderCell>
                                            <Table.HeaderCell>Invited Date</Table.HeaderCell>
                                            <Table.HeaderCell>Action</Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                    {
                                        accountStore.allInvites
                                            .filter(invite => invite.invitee_account_email !== null)
                                            .filter(invite => invite.invitee_account_email.toLowerCase() === commonStore.email!.toLowerCase())
                                            .filter(invite => invite.invitation_status === "Pending")
                                            .map(invite => (
                                                //console.log("Invite =");
                                                //console.log(invite.inviter_account_id);
                                                
                                                <Table.Row key={invite.id}>
                                                    <Table.Cell>
                                                        
                                                        {issueStore.allProjects.find(project => project.id.toLowerCase() === invite.project_to_collaborate_on_id.toLowerCase())!.name}
                                                        
                                                    </Table.Cell>
                                                    <Table.Cell>

                                                        {accountStore.allAccounts.find(account => account.id === invite.inviter_account_id)!.first_name.concat(' ', accountStore.allAccounts.find(account => account.id === invite.inviter_account_id)!.second_name)}
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        {issueStore.allProjects.find(project => project.id === invite.project_to_collaborate_on_id)!.description}
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        Placeholder
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        <Button onClick={() => accountStore.acceptInvitation(invite.id)} size='mini' content='Accept' color='blue' />
                                                        <Button onClick={() => accountStore.declineInvitation(invite.id)} size='mini' content='Decline' color='black' />
                                                    </Table.Cell>
                                                </Table.Row>
                                                
                                            ))
                                    }
                                    </Table.Body>

                            </Table>
                       </div>
                    </div>
        </div>
   )
})