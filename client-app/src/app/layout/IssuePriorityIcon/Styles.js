import styled from 'styled-components';

import { issuePriorityColors } from '../../shared/utils/styles';
import Icon from '../Icon';

export const PriorityIcon = styled(Icon)`
  color: ${props => issuePriorityColors[props.color]};
`;
