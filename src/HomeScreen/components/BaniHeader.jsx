import React from "react";
import { View } from "react-native";
import PropTypes from "prop-types";
import LinearGradient from "react-native-linear-gradient";
import { constant, STRINGS, CustomText, useTheme, useThemedStyles, SafeArea } from "@common";
import createStyles from "../styles";

const BaniHeader = ({ navigate }) => {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  return (
    <SafeArea backgroundColor={theme.colors.surface} edges={["top"]} flex={0}>
      <View style={styles.headerContainer}>
        <View style={styles.fatehContainer}>
          <CustomText style={styles.headerFatehStyle}>
            <CustomText style={styles.ikongkar}>{"<>"} </CustomText>
            {STRINGS.fateh}
          </CustomText>
        </View>
        <View>
          <CustomText style={styles.titleContainer}>
            <CustomText style={styles.headerTitle}> {STRINGS.sg_title} </CustomText>
          </CustomText>
        </View>
      </View>
      <LinearGradient
        colors={
          theme.mode === "dark"
            ? ["rgba(119, 186, 255, 0)", "#77baff", "rgba(119, 186, 255, 0)"]
            : [
                "rgba(17, 57, 121, 0)",
                theme.colors.primary,
                "rgba(17, 57, 121, 0)",
              ]
        }
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={{ height: 1.5, width: "100%", opacity: 0.8 }}
      />
    </SafeArea>
  );
};

export default BaniHeader;
BaniHeader.propTypes = {
  navigate: PropTypes.func.isRequired,
};
