import React from 'react';
import PropTypes from 'prop-types';

import { TypeIcon } from './Styles';

const propTypes = {
  type: PropTypes.string.isRequired,
};

const IssueTypeIcon = ({ type, ...otherProps }) => (
  <TypeIcon type={type} color={color} size={18} {...otherProps} />
);

IssueTypeIcon.propTypes = propTypes;

export default IssueTypeIcon;
