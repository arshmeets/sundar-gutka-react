import React from "react";
import Svg, { Path } from "react-native-svg";
import PropTypes from "prop-types";

const MusicNoteIcon = ({ size = 24, color = "currentColor" }) => (
  <Svg width={size} height={size} fill="none" stroke={color} strokeWidth="1.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <Path d="M9 18V5l12-2v13" />
    <Path d="M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6M18 19a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
  </Svg>
);
MusicNoteIcon.propTypes = { size: PropTypes.number, color: PropTypes.string };
export default MusicNoteIcon;
