import styled from 'styled-components';

import { issueTypeColors } from '../../utils/styles';
import { Icon } from '//Icon';

export const TypeIcon = styled(Icon)`
  color: ${props => issueTypeColors[props.color]};
`;
