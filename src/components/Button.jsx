import styles from "./Button.module.css";

export const ButtonLink = ({
  href,
  onClick,
  disabled,
  children,
  "aria-label": ariaLabel,
  small,
  bleedLeft,
}) => {
  const linkStyles = `${styles.link} ${styles.button} ${
    small ? styles.small : ""
  } ${bleedLeft ? (small ? styles.bleedLeftSmall : styles.bleedLeft) : ""}`;

  return href ? (
    <a href={href} aria-label={ariaLabel} className={linkStyles}>
      {children}
    </a>
  ) : (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={disabled}
      className={linkStyles}
    >
      {children}
    </button>
  );
};

export const ButtonLinkDanger = ({
  href,
  onClick,
  disabled,
  children,
  "aria-label": ariaLabel,
  small,
  bleedLeft,
}) => {
  const linkDangerStyles = `${styles.linkDanger} ${styles.button} ${
    small ? styles.small : ""
  } ${bleedLeft ? (small ? styles.bleedLeftSmall : styles.bleedLeft) : ""}`;

  return href ? (
    <a href={href} aria-label={ariaLabel} className={linkDangerStyles}>
      {children}
    </a>
  ) : (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={disabled}
      className={linkDangerStyles}
    >
      {children}
    </button>
  );
};

export const ButtonPrimary = ({
  href,
  onClick,
  children,
  disabled,
  "aria-label": ariaLabel,
  small,
  fullWidth,
  forceDesktopFullWidth,
  overMedia,
}) => {
  const buttonStyles = `${styles.buttonPrimary} ${styles.button} ${
    small ? styles.small : ""
  } ${fullWidth ? styles.fullWidth : ""} ${overMedia ? styles.overMedia : ""} ${
    forceDesktopFullWidth ? styles.forceDesktopFullWidth : ""
  }`;

  return href ? (
    <a href={href} aria-label={ariaLabel} className={buttonStyles}>
      {children}
    </a>
  ) : (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={disabled}
      className={buttonStyles}
    >
      {children}
    </button>
  );
};

export const ButtonSecondary = ({
  href,
  onClick,
  children,
  disabled,
  "aria-label": ariaLabel,
  small,
  fullWidth,
}) => {
  const buttonSecondaryStyles = `${styles.buttonSecondary} ${styles.button} ${
    small ? styles.small : ""
  } ${fullWidth ? styles.fullWidth : ""}`;

  return href ? (
    <a href={href} aria-label={ariaLabel} className={buttonSecondaryStyles}>
      {children}
    </a>
  ) : (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={disabled}
      className={buttonSecondaryStyles}
    >
      {children}
    </button>
  );
};

export const ButtonDanger = ({
  href,
  onClick,
  children,
  disabled,
  "aria-label": ariaLabel,
  small,
  fullWidth,
}) => {
  const buttonDangerStyles = `${styles.buttonDanger} ${styles.button} ${
    small ? styles.small : ""
  } ${fullWidth ? styles.fullWidth : ""}`;
  return href ? (
    <a href={href} aria-label={ariaLabel} className={buttonDangerStyles}>
      {children}
    </a>
  ) : (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={disabled}
      className={buttonDangerStyles}
    >
      {children}
    </button>
  );
};

export const IconButton = ({
  href,
  onClick,
  disabled,
  "aria-label": ariaLabel,
  "aria-expanded": ariaExpanded,
  "aria-controls": ariaControls,
  "aria-haspopup": ariaHasPopup,
  small,
  bleedLeft,
  bleedRight,
  children,
  overMedia,
}) => {
  const iconButtonStyles = `${styles.iconButton} ${small ? styles.small : ""} ${
    bleedLeft ? (small ? styles.bleedLeftSmall : styles.bleedLeft) : ""
  } ${overMedia ? styles.overMedia : ""}`;

  return href ? (
    <a href={href} aria-label={ariaLabel} className={iconButtonStyles}>
      <div className={styles.iconButtonContainer}>{children}</div>
    </a>
  ) : (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      aria-expanded={ariaExpanded}
      aria-controls={ariaControls}
      aria-haspopup={ariaHasPopup}
      disabled={disabled}
      className={iconButtonStyles}
    >
      <div className={styles.iconButtonContainer}>{children}</div>
    </button>
  );
};
