import React from "react";
import Svg, { Rect } from "react-native-svg";
import PropTypes from "prop-types";
import { colors } from "@common";

const DashboardIcon = ({ size = 24, color = colors.WHITE }) => (
  <Svg
    width={size}
    height={size}
    fill="none"
    stroke={color}
    strokeWidth="1.5"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
  >
    <Rect x="4" y="4" width="7" height="7" rx="1" />
    <Rect x="4" y="13" width="7" height="7" rx="1" />
    <Rect x="13" y="4" width="7" height="7" rx="1" />
    <Rect x="13" y="13" width="7" height="7" rx="1" />
  </Svg>
);

DashboardIcon.propTypes = {
  size: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
};

export default DashboardIcon;
