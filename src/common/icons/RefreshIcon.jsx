import React from "react";
import Svg, { Path } from "react-native-svg";
import PropTypes from "prop-types";

const RefreshIcon = ({ size = 24, color = "currentColor" }) => (
  <Svg width={size} height={size} fill="none" stroke={color} strokeWidth="1.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <Path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <Path d="M3 3v5h5" />
  </Svg>
);
RefreshIcon.propTypes = { size: PropTypes.number, color: PropTypes.string };
export default RefreshIcon;
