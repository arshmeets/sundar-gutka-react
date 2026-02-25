import React from "react";
import Svg, { Circle } from "react-native-svg";
import PropTypes from "prop-types";

const CircleIcon = ({ size = 24, color = "currentColor" }) => (
  <Svg width={size} height={size} fill="none" stroke={color} strokeWidth="1.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <Circle cx="12" cy="12" r="9" />
  </Svg>
);
CircleIcon.propTypes = { size: PropTypes.number, color: PropTypes.string };
export default CircleIcon;
