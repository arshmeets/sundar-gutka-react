import React, { useEffect, useCallback } from "react";
import { StatusBar, ScrollView, View, Pressable } from "react-native";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import useTheme from "@common/context";
import useThemedStyles from "@common/hooks/useThemedStyles";
import { STRINGS, StatusBarComponent, SafeArea, CustomText, useBackHandler } from "@common";
import { BackArrowIcon } from "@common/icons";
import Audio from "./components/audio";
import AutoScroll from "./components/autoScroll";
import BaniLengthComponent from "./components/baniLength";
import CollectStatistics from "./components/collectStatistics";
import ListItemWithIcon from "./components/comon/ListitemWithIcon";
import DatabaseUpdateBanner from "./components/databaseUpdate";
import Donate from "./components/donate";
import EditBaniOrder from "./components/editBaniOrder";
import FontFaceComponent from "./components/fontFace";
import FontSizeComponent from "./components/fontSize";
import KeepAwake from "./components/keepAwake";
import LanguageComponent from "./components/language";
import LarivaarComponent from "./components/larivaar";
import PadchedSettingsComponent from "./components/padched";
import ParagraphMode from "./components/paragraphMode";
import RemindersComponent from "./components/reminders/reminders";
import HideStatusBar from "./components/statusBar";
import ThemeComponent from "./components/theme";
import TranslationComponent from "./components/translation";
import TransliterationComponent from "./components/transliteration";
import VishraamComponent from "./components/vishraam";
import createStyles from "./styles";

const Settings = ({ navigation }) => {
  // Custom back handler to navigate to Home instead of goBack (since Settings is now a tab)
  const handleBackPress = useCallback(() => {
    navigation.navigate("Home");
    return true;
  }, [navigation]);

  useBackHandler(handleBackPress);
  const isDatabaseUpdateAvailable = useSelector((state) => state.isDatabaseUpdateAvailable);

  const { navigate } = navigation;
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const { displayOptionsText, end } = styles;
  const { DISPLAY_OPTIONS, BANI_OPTIONS, OTHER_OPTIONS } = STRINGS;
  const language = useSelector((state) => state.language);
  const { about, databaseUpdate } = STRINGS;

  return (
    <SafeArea backgroundColor={theme.colors.surface} edges={["left", "right"]}>
      <StatusBarComponent backgroundColor={theme.colors.primary} />
      <SafeArea backgroundColor={theme.colors.primary} edges={["top"]} flex={0}>
        <View style={styles.header}>
          <Pressable onPress={handleBackPress} style={styles.backButton}>
            <BackArrowIcon size={25} color={theme.staticColors.WHITE_COLOR} />
          </Pressable>
          <CustomText style={styles.headerTitle}>{STRINGS.settings}</CustomText>
          <View style={styles.headerSpacer} />
        </View>
      </SafeArea>

      {isDatabaseUpdateAvailable && <DatabaseUpdateBanner navigate={navigate} />}
      <ScrollView>
        <CustomText style={displayOptionsText}>{DISPLAY_OPTIONS}</CustomText>
        <FontSizeComponent />
        <FontFaceComponent />
        <LanguageComponent language={language} />
        <TransliterationComponent />
        <TranslationComponent />
        <ThemeComponent />
        <StatusBar />
        <HideStatusBar />
        <AutoScroll />
        <KeepAwake />
        <Audio />
        {/* Bani Options */}
        <CustomText style={displayOptionsText}>{BANI_OPTIONS}</CustomText>
        <EditBaniOrder navigate={navigate} />
        <BaniLengthComponent />
        <LarivaarComponent />
        <ParagraphMode />
        <PadchedSettingsComponent />
        <VishraamComponent />
        <RemindersComponent navigation={navigation} />
        <CustomText style={displayOptionsText}>{OTHER_OPTIONS}</CustomText>
        <CollectStatistics />
        <Donate />
        <ListItemWithIcon
          iconName="info"
          title={about}
          navigate={navigate}
          navigationTarget="About"
        />
        <ListItemWithIcon
          iconName="update"
          title={databaseUpdate}
          navigate={navigate}
          navigationTarget="DatabaseUpdate"
        />
        <CustomText style={end} />
      </ScrollView>
    </SafeArea>
  );
};

Settings.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    setOptions: PropTypes.func,
    getState: PropTypes.func,
  }).isRequired,
};

export default Settings;
