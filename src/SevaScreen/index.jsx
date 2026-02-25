import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Pressable,
  ScrollView,
  TextInput,
  Linking,
  ActivityIndicator,
  AppState,
} from "react-native";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import {
  SafeArea,
  StatusBarComponent,
  CustomText,
  useTheme,
  useThemedStyles,
  STRINGS,
  actions,
  trackSevaEvent,
  SEVA_FUNNEL_STEPS,
} from "@common";
import { getSevaConfig, buildQgivUrl } from "../services/sevaConfig";
import createStyles from "./styles";

// ─── Funnel step index helpers ────────────────────────────────────────────────
const STEP = SEVA_FUNNEL_STEPS.reduce((acc, name, i) => {
  acc[name.toUpperCase()] = i;
  return acc;
}, {});
// Alias readable names
STEP.LANDING = 0;
STEP.DONATION_TYPE = 1;
STEP.AMOUNT = 2;
STEP.PAYMENT = 5;

const SevaScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const dispatch = useDispatch();

  // ─── Redux ────────────────────────────────────────────────────────────────
  const donorState = useSelector((state) => state.donorState);
  const { donor, donorType } = donorState;

  // ─── Config / loading ─────────────────────────────────────────────────────
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // ─── Donation form state ───────────────────────────────────────────────────
  const [selectedAmount, setSelectedAmount] = useState(10);
  const [customAmount, setCustomAmount] = useState("");
  const [isOtherSelected, setIsOtherSelected] = useState(false);
  const [frequency, setFrequency] = useState("Monthly");

  // ─── Funnel tracking ───────────────────────────────────────────────────────
  const maxStepReached = useRef(STEP.LANDING);
  const donationTypeRef = useRef("one_time");
  const appStateRef = useRef(AppState.currentState);

  const effectiveDonationType = frequency === "Monthly" || frequency === "Annually"
    ? "recurring"
    : "one_time";

  const advanceFunnel = (step) => {
    if (step > maxStepReached.current) {
      maxStepReached.current = step;
    }
  };

  // ─── Load config ──────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    getSevaConfig()
      .then((cfg) => {
        if (!cancelled) {
          setConfig(cfg);
          setLoading(false);
          trackSevaEvent("opened", { donor: String(donor) });
          advanceFunnel(STEP.LANDING);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── App state (background detection for abandon tracking) ────────────────
  useEffect(() => {
    const sub = AppState.addEventListener("change", (nextState) => {
      if (
        appStateRef.current === "active" &&
        nextState.match(/inactive|background/)
      ) {
        if (maxStepReached.current < STEP.PAYMENT) {
          trackSevaEvent("checkout_abandoned", {
            last_step_reached: SEVA_FUNNEL_STEPS[maxStepReached.current],
            donation_type: donationTypeRef.current,
          });
        }
      }
      appStateRef.current = nextState;
    });
    return () => sub.remove();
  }, []);

  // ─── Abandon on unmount ────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (maxStepReached.current < STEP.PAYMENT) {
        trackSevaEvent("checkout_abandoned", {
          last_step_reached: SEVA_FUNNEL_STEPS[maxStepReached.current],
          donation_type: donationTypeRef.current,
        });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep donationTypeRef in sync
  useEffect(() => {
    donationTypeRef.current = effectiveDonationType;
  }, [effectiveDonationType]);

  // ─── Handlers ─────────────────────────────────────────────────────────────
  const handleFrequencyChange = (freq) => {
    setFrequency(freq);
    advanceFunnel(STEP.DONATION_TYPE);
    const dtype = freq === "One Time" ? "one_time" : "recurring";
    trackSevaEvent("donation_type_selected", { donation_type: dtype });
  };

  const handleAmountSelect = (amount, isOther = false) => {
    if (isOther) {
      setIsOtherSelected(true);
      // Keep selectedAmount so the card still shows the last preset while the user types
    } else {
      setSelectedAmount(amount);
      setIsOtherSelected(false);
      setCustomAmount("");
      advanceFunnel(STEP.AMOUNT);
      trackSevaEvent("amount_selected", {
        amount: String(amount),
        preset_or_custom: "preset",
        donation_type: effectiveDonationType,
      });
    }
  };

  const handleCustomAmountChange = (val) => {
    setCustomAmount(val);
    if (val) {
      advanceFunnel(STEP.AMOUNT);
      trackSevaEvent("amount_selected", {
        amount: val,
        preset_or_custom: "custom",
        donation_type: effectiveDonationType,
      });
    }
  };

  const handleDonate = useCallback(() => {
    const amount = isOtherSelected ? Number(customAmount) : selectedAmount;
    if (!amount || amount <= 0) return;

    advanceFunnel(STEP.PAYMENT);
    trackSevaEvent("payment_started", {
      provider: "qgiv",
      payment_mode: config?.payment_mode ?? "qgiv_prefill_open",
      donation_type: effectiveDonationType,
      amount_bucket: amount < 25 ? "low" : amount < 75 ? "mid" : "high",
    });

    const url = buildQgivUrl({
      amount,
      donationType: effectiveDonationType,
    });

    Linking.openURL(url).catch(() => {
      Linking.openURL("https://khalisfoundation.org/donate");
    });

    // Optimistically set donor state on return
    dispatch(actions.setDonorState({
      donor: true,
      donorType: effectiveDonationType === "recurring" ? "recurring" : "one_time",
      lastDonationAt: new Date().toISOString(),
      donorSource: "qgiv",
    }));

    trackSevaEvent("payment_success", {
      provider: "qgiv",
      donation_type: effectiveDonationType,
    });
  }, [
    isOtherSelected,
    customAmount,
    selectedAmount,
    effectiveDonationType,
    config,
    dispatch,
  ]);

  const handleOpenSource = () => {
    Linking.openURL("https://github.com/KhalisFoundation/sundar-gutka");
  };

  // ─── Recurring donor: thank-you screen ────────────────────────────────────
  if (!loading && donor && donorType === "recurring") {
    return (
      <SafeArea backgroundColor={theme.colors.surface} edges={["left", "right"]}>
        <StatusBarComponent />
        <View style={[styles.centered, { flex: 1, backgroundColor: "#FFF8E7", paddingTop: 48, paddingHorizontal: 24 }]}>
          <CustomText style={styles.title}>ਵਾਹਿਗੁਰੂ ਜੀ ਕਾ ਖਾਲਸਾ</CustomText>
          <CustomText style={[styles.description, { textAlign: "center" }]}>
            Your monthly seva is making a difference. Thank you for your continued support.
          </CustomText>
          <Pressable
            style={[styles.donateButton, { marginTop: 32 }]}
            onPress={() => dispatch(actions.clearDonorState())}
          >
            <CustomText style={styles.donateButtonText}>Donate Again</CustomText>
          </Pressable>
        </View>
      </SafeArea>
    );
  }

  const content = config?.content ?? {};
  const getFrequencyLabel = () => {
    switch (frequency) {
      case "Monthly":   return "/ month";
      case "Annually":  return "/ year";
      default:          return "";
    }
  };

  // When Other is selected but user hasn't typed yet, show the last preset in the card
  const displayAmount = isOtherSelected && customAmount
    ? customAmount
    : String(selectedAmount ?? "");

  const amounts = config?.defaults?.amounts ?? [10, 50, 100];

  // ─── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <SafeArea backgroundColor={theme.colors.surface} edges={["left", "right"]}>
        <StatusBarComponent />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeArea>
    );
  }

  // ─── Error / offline ──────────────────────────────────────────────────────
  if (error) {
    return (
      <SafeArea backgroundColor={theme.colors.surface} edges={["left", "right"]}>
        <StatusBarComponent />
        <View style={styles.centered}>
          <CustomText style={styles.description}>
            Unable to load Seva. Please check your connection.
          </CustomText>
          <Pressable onPress={() => Linking.openURL("https://khalisfoundation.org/donate")}>
            <CustomText style={[styles.description, { color: theme.colors.primary }]}>
              Donate directly →
            </CustomText>
          </Pressable>
        </View>
      </SafeArea>
    );
  }

  // ─── Main screen ──────────────────────────────────────────────────────────
  return (
    <SafeArea backgroundColor={theme.colors.surface} edges={["left", "right"]}>
      <StatusBarComponent />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          {/* Title */}
          <CustomText style={styles.title}>{content.headline}</CustomText>

          {/* Description */}
          <CustomText style={styles.description}>
            {content.description}
          </CustomText>

          {/* One-time donor CTA banner */}
          {donor && donorType === "one_time" && (
            <View style={styles.retentionBanner}>
              <CustomText style={styles.retentionText}>
                ✨ {content.convertToRecurringCTA}
              </CustomText>
            </View>
          )}

          {/* Amount card — static display OR inline input when Other is selected */}
          <View style={styles.amountCard}>
            <View style={styles.amountContainer}>
              <CustomText style={styles.currency}>$</CustomText>
              {isOtherSelected ? (
                <TextInput
                  style={styles.amountDisplay}
                  value={customAmount}
                  onChangeText={handleCustomAmountChange}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor="#C0CADB"
                  autoFocus
                />
              ) : (
                <CustomText style={styles.amountDisplay}>{displayAmount}</CustomText>
              )}
            </View>
            <CustomText style={styles.perMonth}>{getFrequencyLabel()}</CustomText>
          </View>

          {/* Preset amounts */}
          <View style={styles.amountButtons}>
            {amounts.map((amount) => (
              <Pressable
                key={amount}
                style={[
                  styles.amountButton,
                  selectedAmount === amount && !isOtherSelected && styles.amountButtonSelected,
                ]}
                onPress={() => handleAmountSelect(amount)}
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
              onPress={() => handleAmountSelect(null, true)}
            >
              <CustomText
                style={[styles.amountButtonText, isOtherSelected && styles.amountButtonTextSelected]}
              >
                Other
              </CustomText>
            </Pressable>
          </View>

          {/* Frequency / donation type */}
          <View style={styles.frequencyContainer}>
            {["Monthly", "Annually", "One Time"].map((freq) => (
              <Pressable
                key={freq}
                style={styles.frequencyOption}
                onPress={() => handleFrequencyChange(freq)}
              >
                <View style={styles.radioButton}>
                  {frequency === freq && <View style={styles.radioButtonSelected} />}
                </View>
                <CustomText style={styles.frequencyText}>{freq}</CustomText>
              </Pressable>
            ))}
          </View>

          {/* Donate button */}
          <Pressable style={styles.donateButton} onPress={handleDonate}>
            <View style={styles.donateIconCircle}>
              <CustomText style={styles.donateIcon}>♥</CustomText>
            </View>
            <CustomText style={styles.donateButtonText}>Donate</CustomText>
          </Pressable>

          {/* Open source footer */}
          <Pressable onPress={handleOpenSource}>
            <CustomText style={styles.footerText}>
              {content.footerText}
            </CustomText>
          </Pressable>
        </View>
      </ScrollView>
    </SafeArea>
  );
};

SevaScreen.propTypes = {
  navigation: PropTypes.object,
};

export default SevaScreen;
