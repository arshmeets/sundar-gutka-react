import React, { useEffect } from "react";
import { BackIconComponent } from "@common/components";
import useTheme from "@common/context";
import useThemedStyles from "@common/hooks/useThemedStyles";
import { STRINGS } from "@common";
import createStyles from "../styles";

const useHeader = (navigation) => {
  const { theme } = useTheme();
  const { headerTitleStyle, headerStyle } = useThemedStyles(createStyles);

  const handleBackPress = () => {
    navigation.navigate("Home");
  };

  const headerLeft = () => (
    <BackIconComponent size={30} color={theme.colors.primaryText} onPress={handleBackPress} />
  );

  useEffect(() => {
    navigation.setOptions({
      title: STRINGS.Settings,
      headerTitleStyle,
      headerStyle,
      headerLeft,
    });
  }, [theme]);
};
export default useHeader;
