import React, { useCallback } from "react";
import { Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import PropTypes from "prop-types";
import { BackArrowIcon } from "@common/icons";

const BackIconComponent = ({ size, color, onPress }) => {
  const navigation = useNavigation();

  const handleBackPress = useCallback(() => {
    if (onPress) {
      onPress();
    } else {
      navigation.goBack();
    }
  }, [onPress, navigation]);

  return (
    <Pressable onPress={handleBackPress}>
      <BackArrowIcon size={size} color={color} />
    </Pressable>
  );
};

BackIconComponent.defaultProps = {
  size: 25,
};
BackIconComponent.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string.isRequired,
  onPress: PropTypes.func,
};

export default BackIconComponent;
