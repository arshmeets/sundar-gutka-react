import React, { useState, useEffect, useCallback, useRef } from "react";
import { View, Pressable, Animated } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import PropTypes from "prop-types";
import useTheme from "@common/context";
import useThemedStyles from "@common/hooks/useThemedStyles";
import {
  HomeIcon,
  SettingsIcon,
  MusicIcon,
  ReadIcon,
  DashboardIcon,
  SevaIcon,
} from "@common/icons";
import { CustomText, actions, constant, STRINGS, SafeArea } from "@common";
import { getSevaConfig } from "../../../services/sevaConfig";
import createStyles from "./style";

const BottomNavigation = ({
  activeKey,
  context = "home",
  visible = true,
  navigation: propNavigation,
}) => {
  const hookNavigation = useNavigation();
  const navigation = propNavigation || hookNavigation;
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const isAudio = useSelector((state) => state.isAudio);
  const [isSettings, setIsSettings] = useState(false);
  const [previousRouteName, setPreviousRouteName] = useState(null);
  const [showSevaDot, setShowSevaDot] = useState(false);
  const translateY = useRef(new Animated.Value(0)).current;

  // Helper function to get current route name
  const getCurrentRouteName = useCallback(() => {
    const navState = navigation.getState();
    return navState?.routes[navState?.index]?.name;
  }, [navigation]);

  // Animate visibility
  useEffect(() => {
    Animated.timing(translateY, {
      toValue: visible ? 0 : 100,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible, translateY]);

  // Load seva dot state from config
  useEffect(() => {
    let cancelled = false;
    getSevaConfig().then((cfg) => {
      if (!cancelled) setShowSevaDot(!!cfg?.showSevaDot);
    }).catch(() => {});
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const updateIsSettings = () => {
      const state = navigation.getState?.();
      if (!state) return;

      const topRoute = state.routes[state.index];
      let currentRouteName = topRoute?.name;

      // Handle nested navigators just in case
      if (topRoute?.state && typeof topRoute.state.index === "number") {
        const nestedRoute = topRoute.state.routes[topRoute.state.index];
        currentRouteName = nestedRoute?.name ?? currentRouteName;
      }

      // When entering Settings, check the previous route in navigation stack
      if (currentRouteName === constant.SETTINGS) {
        // Get the previous route from navigation state
        if (state.index > 0) {
          const prevRoute = state.routes[state.index - 1];
          let prevRouteName = prevRoute?.name;
          if (prevRoute?.state && typeof prevRoute.state.index === "number") {
            const nestedRoute = prevRoute.state.routes[prevRoute.state.index];
            prevRouteName = nestedRoute?.name ?? prevRouteName;
          }
          setPreviousRouteName(prevRouteName);
        }
      } else {
        // Update previous route when not on Settings
        setPreviousRouteName(currentRouteName);
      }

      setIsSettings(currentRouteName === constant.SETTINGS);
    };

    // Run once on mount
    updateIsSettings();

    // Subscribe to navigation state changes
    const unsubscribe =
      navigation.addListener?.("state", () => {
        updateIsSettings();
      }) || undefined;

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [navigation]);

  // Define navigation items based on context
  const homeNavigationItems = [
    {
      key: "Home",
      icon: HomeIcon,
      handlePress: () => {
        navigation.navigate("Home");
      },
      text: STRINGS.HOME,
    },
    {
      key: "Dashboard",
      icon: DashboardIcon,
      handlePress: () => {
        navigation.navigate(constant.DASHBOARD);
      },
      text: STRINGS.DASHBOARD,
    },
    {
      key: "Seva",
      icon: SevaIcon,
      showDot: showSevaDot,
      handlePress: () => {
        navigation.navigate(constant.SEVA);
      },
      text: STRINGS.SEVA,
    },
    {
      key: "Settings",
      icon: SettingsIcon,
      handlePress: () => {
        navigation.navigate(constant.SETTINGS);
      },
      text: STRINGS.SETTINGS,
    },
  ];

  const readerNavigationItems = [
    {
      key: "Home",
      icon: HomeIcon,
      handlePress: () => {
        navigation.popToTop();
      },
      text: STRINGS.HOME,
    },
    {
      key: "Read",
      icon: ReadIcon,
      handlePress: () => {
        const currentNavRoute = getCurrentRouteName();

        if (currentNavRoute === constant.SETTINGS) {
          navigation.goBack();
        }
        if (isAudio) {
          dispatch(actions.toggleAudio(false));
        }
      },
      text: STRINGS.READ,
    },
    {
      key: "Music",
      icon: MusicIcon,
      handlePress: () => {
        const currentNavRoute = getCurrentRouteName();

        if (currentNavRoute === constant.SETTINGS) {
          navigation.goBack();
        }

        dispatch(actions.toggleAutoScroll(false));

        // If coming from Settings and previous route was Reader, keep audio ON
        if (currentNavRoute === constant.SETTINGS && isAudio) {
          dispatch(actions.toggleAudio(true));
        } else {
          dispatch(actions.toggleAudio(!isAudio));
        }
      },
      text: STRINGS.MUSIC,
    },
    {
      key: "Settings",
      icon: SettingsIcon,
      handlePress: () => {
        navigation.navigate(constant.SETTINGS);
      },
      text: STRINGS.SETTINGS,
    },
  ];

  // Choose navigation items based on context
  const navigationItems =
    context === "reader" ? readerNavigationItems : homeNavigationItems;

  // Filter out Read and Music when on Settings page in reader context, but keep them if previous route was Read
  const shouldHideReadAndMusic =
    context === "reader" && isSettings && previousRouteName !== constant.READER;
  const filteredNavigationItems = shouldHideReadAndMusic
    ? navigationItems.filter(
        (item) => item.key !== "Read" && item.key !== "Music"
      )
    : navigationItems;

  return (
    <Animated.View
      style={{
        transform: [{ translateY }],
      }}
    >
      <SafeArea
        backgroundColor={theme.colors.primary}
        edges={["bottom"]}
        flex={0}
      >
        <View style={[styles.container]}>
          <View style={styles.navigationBar}>
            {filteredNavigationItems.map((item) => {
              const IconComponent = item.icon;

              return (
                <Pressable
                  key={item.key}
                  style={[
                    styles.iconContainer,
                    item.key === activeKey && styles.activeIconContainer,
                  ]}
                  onPress={item.handlePress}
                  accessibilityRole="button"
                  accessibilityLabel={`bottomnav-${item.key}`}
                >
                  <View style={{ position: "relative" }}>
                    <IconComponent
                      size={24}
                      color={
                        item.key === activeKey
                          ? theme.colors.primary
                          : theme.staticColors.WHITE_COLOR
                      }
                    />
                    {!!item.showDot && (
                      <View
                        style={{
                          position: "absolute",
                          top: -3,
                          right: -3,
                          width: 10,
                          height: 10,
                          borderRadius: 5,
                          backgroundColor: "#E53E3E",
                          borderWidth: 1.5,
                          borderColor: theme.colors.primary,
                        }}
                      />
                    )}
                  </View>
                  {activeKey !== item.key && (
                    <CustomText style={styles.iconText}>{item.text}</CustomText>
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>
      </SafeArea>
    </Animated.View>
  );
};

BottomNavigation.propTypes = {
  activeKey: PropTypes.string.isRequired,
  context: PropTypes.oneOf(["home", "reader"]),
  visible: PropTypes.bool,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
};

export default BottomNavigation;
