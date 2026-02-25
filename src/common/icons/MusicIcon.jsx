import React from "react";
import Svg, { Path } from "react-native-svg";
import PropTypes from "prop-types";

const MusicIcon = ({ size = 24, color = "currentColor" }) => (
  <Svg width={size} height={size} fill="none" stroke={color} strokeWidth="1.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <Path d="M3 18a2 2 0 1 0 4 0 2 2 0 0 0-4 0M17 16a2 2 0 1 0 4 0 2 2 0 0 0-4 0M7 18V7l13-3v10" />
    <Path d="M7 11l13-3" />
  </Svg>
);
MusicIcon.propTypes = { size: PropTypes.number, color: PropTypes.string };
export default MusicIcon;
