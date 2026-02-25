import React from "react";
import Svg, { Rect } from "react-native-svg";
import PropTypes from "prop-types";

const StopIcon = ({ size = 24, color = "currentColor" }) => (
  <Svg width={size} height={size} fill="none" stroke={color} strokeWidth="1.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <Rect x="5" y="5" width="14" height="14" rx="2" />
  </Svg>
);
StopIcon.propTypes = { size: PropTypes.number, color: PropTypes.string };
export default StopIcon;
