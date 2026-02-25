import React from "react";
import Svg, { Path } from "react-native-svg";
import PropTypes from "prop-types";

const ExpandCollapseIcon = ({ size = 24, color = "currentColor" }) => (
  <Svg width={size} height={size} fill="none" stroke={color} strokeWidth="1.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <Path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
  </Svg>
);
ExpandCollapseIcon.propTypes = { size: PropTypes.number, color: PropTypes.string };
export default ExpandCollapseIcon;
