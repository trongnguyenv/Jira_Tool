import React from 'react';
import PropTypes from 'prop-types';

import { StyledIcon } from './Styles';


const propTypes = {
  className: PropTypes.string,
  size: PropTypes.string,
  left: PropTypes.number,
  top: PropTypes.number
};

const defaultProps = {
  className: undefined,
  size: 12,
  left: 0,
  top: 0,
};

const BetterIcon = ({ code, ...iconProps }) => (
  <StyledIcon {...iconProps} code={code} />
);

BetterIcon.propTypes = propTypes;
BetterIcon.defaultProps = defaultProps;

export default BetterIcon;
