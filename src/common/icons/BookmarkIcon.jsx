import React from "react";
import Svg, { Path } from "react-native-svg";
import PropTypes from "prop-types";

const BookmarkIcon = ({ size = 24, color = "currentColor" }) => (
  <Svg width={size} height={size} fill="none" stroke={color} strokeWidth="1.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <Path d="M5 3h14a1 1 0 0 1 1 1v17l-7-3.5L6 21V4a1 1 0 0 1 1-1z" />
  </Svg>
);
BookmarkIcon.propTypes = { size: PropTypes.number, color: PropTypes.string };
export default BookmarkIcon;
