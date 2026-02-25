import React from "react";
import Svg, { Path } from "react-native-svg";
import PropTypes from "prop-types";

const PauseIcon = ({ size = 24, color = "currentColor" }) => (
  <Svg width={size} height={size} fill="none" stroke={color} strokeWidth="1.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <Path d="M10 9v6M14 9v6" />
  </Svg>
);
PauseIcon.propTypes = { size: PropTypes.number, color: PropTypes.string };
export default PauseIcon;
