
import styled, { css } from 'styled-components';


interface ISprintSection {
    sprint_name: string;
}

export const SprintSection = styled.div<ISprintSection>`
    width: 100%;
    position: relative;
    display: block;
    margin: 0 0x;
    border-radius: 0px;
    ${props =>
    props.sprint_name !== "Backlog" &&
    css`
      background: #1D1F21 !important;
    `}
`

export const SprintSectionIssueContainer = styled.div`
    width: 97%;
    display: block;
    min-height: 40px;
    position: relative;
    top: 10px;
    margin-top: 10px;
    //padding-top: 10px;
    margin-bottom: 10px;
    margin-left: 15px;
    margin-right: 10px;
    border: dashed;
    border-color: #303436 !important;
    background: #1D1F21 !important;
`

export const SprintSectionBacklog = styled.div`
    width: 100%;
    position: relative;
    display: block;
    margin: 0 0px;
    right: 1px;
    border-radius: 3px;
`


export const SprintSectionIssueContainerEmpty = styled.div`
    width: 97%;
    display: block;
    height: 40px;
    position: relative;
    top: 10px;
    margin-top: 10px;
    padding-top: 10px;
    margin-bottom: 10px;
    margin-left: 15px;
    margin-right: 10px;
    border: dashed;
    border-color: #303436 !important;
    background: #1D1F21 !important;
`

export const List = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 5px;
  min-height: 400px;
  width: 25%;
  border-radius: 3px;
  background: #1D1F21 !important;
`;


export const font = {
    regular: 'font-family: "CircularStdBook"; font-weight: normal;',
    medium: 'font-family: "CircularStdMedium"; font-weight: normal;',
    bold: 'font-family: "CircularStdBold"; font-weight: normal;',
    black: 'font-family: "CircularStdBlack"; font-weight: normal;',
    size: (size: any) => `font-size: ${size}px;`,
  };

export const ItemText = styled.div`
  margin-right: 12px;
  visibility: visible;
  opacity: 1;
  transition: all 0.1s;
  transition-property: right, visibility, opacity;
  ${font.bold}
  ${font.size(12)}
`;


export const Bottom = styled.div`
  position: absolute;
  bottom: 20px;
  left: 0;
  width: 100%;
`;


export const color = {
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

  backgroundDarkPrimary: '#181A1A',
  backgroundMedium: '#dfe1e6',
  backgroundLight: '#ebecf0',
  backgroundLightest: '#F4F5F7',
  backgroundLightPrimary: '#D2E5FE',
  backgroundLightSuccess: '#E4FCEF',

  borderLightest: '#dfe1e6',
  borderLight: '#C1C7D0',
  borderInputFocus: '#4c9aff',
}

export const sizes = {
  appNavBarLeftWidth: 64,
  secondarySideBarWidth: 230,
  minViewportWidth: 1000,
}

const zIndexValues = {
  modal: 1000,
  dropdown: 101,
  navLeft: 100,
}


export const mixin = {

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

export const NavLeft = styled.aside`
    z-index: ${zIndexValues.navLeft};
    position: fixed;
    top: 0;
    left: 0;
    overflow-x: hidden;
    margin-top: 39px;
    height: 100vh;
    width: ${sizes.appNavBarLeftWidth}px;
    background: ${color.backgroundDarkPrimary};
    transition: all 0.1s;
    ${mixin.hardwareAccelerate}
    &:hover {
    width: 200px;
    box-shadow: 0 0 40px 0 rgba(0, 0, 0, 0.6);
    }
`
export const Item = styled.div`
  position: relative;
  width: 100%;
  height: 42px;
  line-height: 42px;
  padding-left: 10px;
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