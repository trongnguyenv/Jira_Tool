import React, { useEffect, useState, useLayoutEffect } from 'react';
import styled from 'styled-components';
import { Container, Modal } from 'semantic-ui-react';
import { css } from 'styled-components';
import './fontStyles.css';
import IssueDashboard from '../features/sprints/dashboard/IssuesDashboard';
import InsightsDashboard from '../features/sprints/dashboard/InsightsDashboard';
import SprintPage from '../features/sprints/SprintPage';
import LoadingComponent from './LoadingComponent';
import NavBarTop from './NavBarTop';
import { useStore } from '../stores/store';
import { observer } from 'mobx-react-lite';
import ModalContainer from '../shared/modals/ModalContainer';
import MediumModalContainer from '../shared/modals/MediumModalContainer';
import SmallModalContainer from '../shared/modals/SmallModalContainer';
import NavbarRight from './NavbarRight';
import AboutPage from './About';
import { Route } from 'react-router-dom';
import LoginForm from '../features/sprints/form/login/LoginForm';
import backgroundImage3 from './shmirabackground3.jpg';
import ActivateAccountForm from '../features/sprints/form/login/ActivateAccountForm';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../darkmode.css';



function App() {
  const { issueStore, commonStore, accountStore } = useStore();

  useEffect(() => {
    issueStore.loadingInitial = true;
    accountStore.accountsLoading = true;
    commonStore.loadInitial();
  }, [])

if (
  issueStore.loadingInitial || 
  commonStore.assignee_id === null && 
  (
    accountStore.accountsLoading || 
    issueStore.loadingInitial
  )
) return <><LoadingComponent content='Loading...'/></>

if(commonStore.token === null && !accountStore.accountsLoading && !issueStore.loadingInitial)  {
  {console.log("App started")}
  return (
  <div style={{
    height: '100vh',   
    backgroundImage: `url(${backgroundImage3})`, 
    filter: `brightness(100%)`, 
    backgroundSize: 'cover',  
    display: 'flex', 
    flexWrap: 'wrap', 
    justifyContent: 'center' 
    }}>
    <div 
      className='modal' 
      style={{        
        backgroundColor: `transparent`, 
        width: '40%',
        height: '500px',
        marginTop: '280px',
        backdropFilter: `brightness(125%) saturate(150%) blur(10px)`}} 
        >
      
      <div className='modal-content'>
        <Route exact path='/' component={LoginForm}  />
        <Route path='/sprints' component={LoginForm} />
        <Route path='/login' component={LoginForm} />
        <Route path='/invite' component={LoginForm} />
        <Route path='/insights' component={LoginForm} />
        <Route path='/activate' component={ActivateAccountForm} />
      </div>
    </div>
  </div>
  )}
  
  else if(
    issueStore.selectedProject! !== undefined && 
    !accountStore.accountsLoading && 
    !issueStore.loadingInitial
  ){
    return (
      <div>
      {
        <div>
          <ModalContainer />
          <SmallModalContainer />
          <MediumModalContainer />
          <NavBarTop />
          <NavbarRight />
          <Container style={{marginTop: '7em'}}>
            <Route exact path='/' component={IssueDashboard} />
            <Route path='/insights' component={InsightsDashboard} />
            <Route path='/sprints' component={SprintPage} />
            <Route path='/about' component={AboutPage} />
          </Container>    
        </div>
      }
      { 
        <ToastContainer
            position="bottom-right"
            theme='dark'
            autoClose={false}
            hideProgressBar={true}
            newestOnTop={false}
            closeOnClick={true}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
        />
      }
    </div>
    );
  }
  return (<></>)
}

export default observer(App);






















const font = {
  regular: 'font-family: "CircularStdBook"; font-weight: normal;',
  medium: 'font-family: "CircularStdMedium"; font-weight: normal;',
  bold: 'font-family: "CircularStdBold"; font-weight: normal;',
  black: 'font-family: "CircularStdBlack"; font-weight: normal;',
  size: (size: any) => `font-size: ${size}px;`,
};

const Bottom = styled.div`
position: absolute;
bottom: 20px;
left: 0;
width: 100%;
`;


const color = {
primary: '#0052cc', // Blue
success: '#0B875B', // green
danger: '#E13C3C', // red
warning: '#F89C1C', // orange
secondary: '#F4F5F7', // light grey

textDarkest: '#172b4d',
textDark: '#42526E',
textMedium: '#5E6C84',
textLight: '#8993a4',
textLink: '#0052cc',

backgroundDarkPrimary: '#0747A6',
backgroundMedium: '#dfe1e6',
backgroundLight: '#ebecf0',
backgroundLightest: '#F4F5F7',
backgroundLightPrimary: '#D2E5FE',
backgroundLightSuccess: '#E4FCEF',

borderLightest: '#dfe1e6',
borderLight: '#C1C7D0',
borderInputFocus: '#4c9aff',
}

const sizes = {
appNavBarLeftWidth: 64,
secondarySideBarWidth: 230,
minViewportWidth: 1000,
}

const zIndexValues = {
modal: 1000,
dropdown: 101,
navLeft: 100,
}


const mixin = {

hardwareAccelerate: css`
  transform: translateZ(0);
`,
cover: css`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`,
  clickable: css`
  cursor: pointer;
  user-select: none;
`
}

const NavLeft = styled.aside`
z-index: ${zIndexValues.navLeft};
position: fixed;
top: 0;
left: 0;
overflow-x: hidden;
height: 100vh;
width: ${sizes.appNavBarLeftWidth}px;
background: ${color.backgroundDarkPrimary};
transition: all 0.1s;
${mixin.hardwareAccelerate}
&:hover {
width: 200px;
box-shadow: 0 0 50px 0 rgba(0, 0, 0, 0.6);
}
`
const Item = styled.div`
position: relative;
width: 100%;
height: 42px;
line-height: 42px;
padding-left: 64px;
color: #deebff;
transition: color 0.1s;
${mixin.clickable}
&:hover {
  background: rgba(255, 255, 255, 0.1);
}
i {
  position: absolute;
  left: 18px;
}
`;

const ItemText = styled.div`
position: relative;
right: 12px;
visibility: hidden;
opacity: 0;
text-transform: uppercase;
transition: all 0.1s;
transition-property: right, visibility, opacity;
${font.bold}
${font.size(12)}
${NavLeft}:hover & {
  right: 0;
  visibility: visible;
  opacity: 1;
}
`;