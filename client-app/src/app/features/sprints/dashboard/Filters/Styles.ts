import styled, { css } from 'styled-components';
import { Input } from 'semantic-ui-react';
import Avatar from 'react-avatar';

export const SearchFilter = styled(Input)`
    margin-left: 40px;
    margin-bottom: 20px;
    margin-right: 30px;
`

interface IStyledAvatar {
    index: number;
}

export const StyledAvatar = styled(Avatar)`
    &:hover {
    //transform: translateY(-3px);
  };
  cursor: pointer;
  //margin-left: -6px;
`

export const StyledLabelAvatar = styled(Avatar)`
    &:hover {
    //transform: translateY(-3px);
  };
  cursor: pointer;
  margin-right: 12px;
  //margin-left: -6px;
`


export const SelectedAvatar = styled(Avatar)`
  &:hover {
    //transform: translateY(-3px);
  }
  outline: 1px;
  overflow: visible;
  outline-style: solid;
  outline-color: "#FFFFFF !important";
  cursor: pointer;
`

interface IActiveAvatar {
    isActive: boolean;
    index: number;
}

export const AvatarIsActiveBorder = styled.div<IActiveAvatar>`
  display: inline-block;
  border-radius: 50%;
  //position: relative;
  margin-right: -6px;
  direction: ltr;
  ${props => props.isActive && `border: 2px solid #0052cc !important; `}

  &:hover {
    transform: translateY(-7px) !important;
  }
`;

export const AvatarIsActiveLabelBorder = styled.div<IActiveAvatar>`
  display: inline-block;
  border-radius: 50%;
  //position: relative;
  margin-right: -6px;
  direction: ltr;
  ${props => props.isActive && `border: 2px solid #0052cc !important; `}
`;