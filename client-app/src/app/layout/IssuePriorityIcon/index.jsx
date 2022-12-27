
import { IssuePriority } from '../../shared/constants/issues';

import { PriorityIcon } from './Styles';


const IssuePriorityIcon = ({ priority }) => {
  const iconType = [IssuePriority.LOW].includes(priority)
    ? 'arrow-down'
    : 'arrow-up';

  return <PriorityIcon type={iconType} color={priority} size={15} />;
};


export default IssuePriorityIcon;
