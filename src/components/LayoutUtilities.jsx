import styles from "./LayoutUtilities.module.css";

export const Stack = ({ children, gap = "0.5rem" }) => {
  const stackStyles = {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    gap: gap,
  };

  return <div style={stackStyles}>{children}</div>;
};

export const Inline = ({
  children,
  gap = "0.5rem",
  wrap,
  align,
  justify,
  fullWidth,
}) => {
  const inlineStyles = {
    display: fullWidth ? "flex" : "inline-flex",
    gap: gap,
    flexWrap: wrap ? "wrap" : "nowrap",
    alignItems: align,
    justifyContent: justify,
  };

  return <div style={inlineStyles}>{children}</div>;
};

export const Box = ({
  children,
  padding,
  paddingTop,
  paddingRight,
  paddingBottom,
  paddingLeft,
  paddingY,
  paddingX,
}) => {
  const boxStyles = {
    padding,
    paddingTop: paddingTop ?? paddingY,
    paddingBottom: paddingBottom ?? paddingY,
    paddingLeft: paddingLeft ?? paddingX,
    paddingRight: paddingRight ?? paddingX,
  };

  return <div style={boxStyles}>{children}</div>;
};

export const HorizontalScroll = ({ children, className }) => {
  const scrollStyles = {
    display: "flex",
    overflowX: "auto",
  };

  const horizontalScrollStyles = `${styles.horizontalScroll} ${
    className || ""
  }`;

  return (
    <div style={scrollStyles} className={horizontalScrollStyles}>
      {children}
    </div>
  );
};
