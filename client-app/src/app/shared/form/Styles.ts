import styled from 'styled-components';
import {Input} from 'semantic-ui-react'

interface IInvisibleTextInput {
    fontsize: number;
}

export const InvisibleTextInput = styled.div<IInvisibleTextInput>`
    width: 100%;
    margin-bottom: 6px;
    color: #FFFFFF !important;
    &:hover {
    backdrop-filter: brightness(1.2) !important;
  }
   ${props => props.fontsize && `font-size: ${props.fontsize} !important;`}

`

export const StyledInput = styled(Input)`
    width: 100%;
`