import React, { useState, useCallback, useRef } from "react";
import { View, Pressable, ScrollView, TextInput, Linking } from "react-native";
import PropTypes from "prop-types";
import {
  SafeArea,
  StatusBarComponent,
  CustomText,
  useTheme,
  useThemedStyles,
  BottomNavigation,
  STRINGS,
  constant,
} from "@common";
import { BackArrowIcon } from "@common/icons";
import createStyles from "./styles";

const SevaScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const [selectedAmount, setSelectedAmount] = useState(50);
  const [customAmount, setCustomAmount] = useState("");
  const [isOtherSelected, setIsOtherSelected] = useState(false);
  const [frequency, setFrequency] = useState("Monthly");

  const handleBackPress = () => {
    navigation.goBack();
  };

  const getFrequencyText = () => {
    switch (frequency) {
      case "Monthly":
        return "/ month";
      case "Annually":
        return "/ year";
      case "One Time":
        return "";
      default:
        return "/ month";
    }
  };

  const handleDonate = () => {
    const amount = customAmount || selectedAmount;
    // Open Khalis Foundation donation page
    Linking.openURL(constant.KHALIS_FOUNDATION_URL);
  };

  const handleOpenSource = () => {
    // Open GitHub or contribution page
    Linking.openURL("https://github.com/KhalisFoundation");
  };

  const amounts = [10, 50, 100];

  return (
    <SafeArea backgroundColor={theme.colors.surface} edges={["left", "right"]}>
      <StatusBarComponent backgroundColor={theme.colors.primary} />
      <SafeArea backgroundColor={theme.colors.primary} edges={["top"]} flex={0}>
        <View style={styles.header}>
          <Pressable onPress={handleBackPress} style={styles.backButton}>
            <BackArrowIcon size={25} color={theme.staticColors.WHITE_COLOR} />
          </Pressable>
          <CustomText style={styles.headerTitle}>{STRINGS.SEVA}</CustomText>
          <View style={styles.headerSpacer} />
        </View>
      </SafeArea>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.container}>
          {/* Title */}
          <CustomText style={styles.title}>ਸੁੰਦਰ ਗੁਟਕਾ</CustomText>

          {/* Description */}
          <CustomText style={styles.description}>
            Is built by volunteers at <CustomText style={styles.link}>Khalis Foundation</CustomText>, a non
            profit organization that builds software like Sundar Gutka and{" "}
            <CustomText style={styles.link}>SikhiToTheMax</CustomText>. Khalis helps millions of
            Sikhs around the world connect with Gurbani. You can be part of this seva as well;
            serve millions with a single donation.
          </CustomText>

          {/* Amount Display */}
          <View style={styles.amountContainer}>
            <CustomText style={styles.currency}>$</CustomText>
            <CustomText style={styles.amountDisplay}>
              {isOtherSelected ? (customAmount || "0") : selectedAmount}
            </CustomText>
          </View>
          <CustomText style={styles.perMonth}>{getFrequencyText()}</CustomText>

          {/* Preset Amounts */}
          <View style={styles.amountButtons}>
            {amounts.map((amount) => (
              <Pressable
                key={amount}
                style={[
                  styles.amountButton,
                  selectedAmount === amount && !isOtherSelected && styles.amountButtonSelected,
                ]}
                onPress={() => {
                  setSelectedAmount(amount);
                  setIsOtherSelected(false);
                  setCustomAmount("");
                }}
              >
                <CustomText
                  style={[
                    styles.amountButtonText,
                    selectedAmount === amount && !isOtherSelected && styles.amountButtonTextSelected,
                  ]}
                >
                  ${amount}
                </CustomText>
              </Pressable>
            ))}
            <Pressable
              style={[styles.amountButton, isOtherSelected && styles.amountButtonSelected]}
              onPress={() => setIsOtherSelected(true)}
            >
              <CustomText
                style={[styles.amountButtonText, isOtherSelected && styles.amountButtonTextSelected]}
              >
                Other
              </CustomText>
            </Pressable>
          </View>

          {/* Custom Amount Input - Shows when Other is selected */}
          {isOtherSelected && (
            <View style={styles.customAmountContainer}>
              <CustomText style={styles.customAmountLabel}>Enter Amount:</CustomText>
              <View style={styles.customAmountInputContainer}>
                <CustomText style={styles.customAmountCurrency}>$</CustomText>
                <TextInput
                  style={styles.customAmountInput}
                  value={customAmount}
                  onChangeText={setCustomAmount}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor={theme.colors.textSecondary}
                  autoFocus
                />
              </View>
            </View>
          )}

          {/* Frequency Options */}
          <View style={styles.frequencyContainer}>
            {["Monthly", "Annually", "One Time"].map((freq) => (
              <Pressable
                key={freq}
                style={styles.frequencyOption}
                onPress={() => setFrequency(freq)}
              >
                <View style={styles.radioButton}>
                  {frequency === freq && <View style={styles.radioButtonSelected} />}
                </View>
                <CustomText style={styles.frequencyText}>{freq}</CustomText>
              </Pressable>
            ))}
          </View>

          {/* Donate Button */}
          <Pressable style={styles.donateButton} onPress={handleDonate}>
            <View style={styles.donateIconCircle}>
              <CustomText style={styles.donateIcon}>♥</CustomText>
            </View>
            <CustomText style={styles.donateButtonText}>Donate</CustomText>
          </Pressable>

          {/* Footer Text */}
          <CustomText style={styles.footerText}>
            Know coding? You can also do seva through open source contributions
          </CustomText>
        </View>
      </ScrollView>
      <BottomNavigation activeKey="Seva" context="home" visible={true} />
    </SafeArea>
  );
};

SevaScreen.propTypes = {
  navigation: PropTypes.shape({ navigate: PropTypes.func.isRequired }).isRequired,
};

export default SevaScreen;
