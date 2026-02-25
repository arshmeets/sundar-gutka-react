import React from "react";
import Svg, { Path } from "react-native-svg";
import PropTypes from "prop-types";

const plusIcon = ({ size = 24, color = "currentColor" }) => (
  <Svg width={size} height={size} fill="none" stroke={color} strokeWidth="1.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <Path d="M12 5v14M5 12h14" />
  </Svg>
);
plusIcon.propTypes = { size: PropTypes.number, color: PropTypes.string };
export default plusIcon;
