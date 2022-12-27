import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';

import { color, font, mixin } from '../../../../shared/utils/styles';
import { Issue } from '../../../../models/issue';
//import { Avatar } from 'shared/components';

export const IssueLink = styled(Link)`
  display: block;
  margin-bottom: 5px;
`;

interface IIssueCard {
  isBeingDragged: boolean
}

export const IssueCard = styled.div<IIssueCard>`
  padding: 10px;
  margin-bottom: 5px;
  border-radius: 3px;
  cursor: move !important;
  background: #181A1A !important;
  //transition: background 0.1s;
  &:hover {
    backdrop-filter: brightness(120%);
    filter: brightness(140%);
  };
  ${mixin.clickable}
  @media (max-width: 1100px) {
    padding: 10px 8px 8px;
  }
  ${props =>
    props.isBeingDragged &&
    css`
      transform: rotate(3deg);
      //box-shadow: 5px 10px 30px 0px rgba(9, 30, 66, 0.15);
    `}
`;


export const IssueCardSprintVersion = styled.div<IIssueCard>`
  padding: 10px;
  border-radius: 1px;
  border: solid;
  cursor: move !important;
  border-width: thin;
  width: 100%;
  height: 40px;
  background: #181A1A !important;
  &:hover {
    backdrop-filter: brightness(120%);
    filter: brightness(140%);
  };
  border-color: #303436 !important;
  ${mixin.clickable}
  @media (max-width: 1100px) {
    padding: 10px 8px 8px;
  }
  ${props =>
    props.isBeingDragged &&
    css`
      //transform: rotate(3deg);
      //box-shadow: 5px 10px 30px 0px rgba(9, 30, 66, 0.15);
    `}
`;

export const Title = styled.p`
  padding-bottom: 11px;
  ${font.size(13.5)}
  @media (max-width: 1100px) {
    ${font.size(13.5)}
  }
`;

export const TitleSprintVersion = styled.p`
  padding-bottom: 5px;
  ${font.size(12)}
  @media (max-width: 1100px) {
    ${font.size(12)}
  }
`;

export const Bottom = styled.div`
  //display: flex;
  //justify-content: space-between;
  //align-items: right;
  float: right;
  margin-right: 5px;
`;

export const Assignees = styled.div`
  display: flex;
  flex-direction: row-reverse;
  margin-left: 2px;
`;

/*
export const AssigneeAvatar = styled(Avatar)`
  margin-left: -2px;
  //box-shadow: 0 0 0 2px #fff;
`;
*/