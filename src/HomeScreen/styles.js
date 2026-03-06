const createStyles = (theme) => ({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: theme.colors.surface,
  },
  fateh: {
    color: "#326194",
    fontSize: theme.typography.sizes.xl,
    textAlign: "center",
    margin: theme.spacing.sm,
  },
  headerDesign: {
    fontSize: theme.typography.sizes.massive,
    color: theme.colors.surface,
    fontFamily: theme.typography.fonts.gurbaniPrimary,
  },
  headerTitle: {
    fontSize: theme.typography.sizes.huge,
    color: theme.colors.primary,
    fontWeight: theme.typography.weights.bold,
  },
  titleContainer: {
    textAlign: "center",
    margin: theme.spacing.sm,
  },
  settingIcon: {
    position: "absolute",
    bottom: theme.spacing.md,
    right: theme.spacing.sm,
  },
  headerFatehStyle: {
    color: "#326194",
    fontSize: theme.typography.sizes.xl,
  },
  fatehContainer: {
    marginLeft: "auto",
    marginRight: "auto",
  },
  ikongkar: {
    fontFamily: theme.typography.fonts.gurbaniPrimary,
    color: "#326194",
    fontSize: theme.typography.sizes.xxl,
  },
  headerContainer: {
    backgroundColor: theme.colors.surface,
    paddingBottom: theme.spacing.md,
  },
});

export default createStyles;
