import styles from "./SidenavLayout.module.css";
import Chip from "./Chip";

const SidenavLayout = ({ children, items }) => {
  return (
    <div className={styles.container}>
      <div className={styles.sidenavDesktop}>
        <nav className={styles.nav}>
          <ul className={styles.navList}>
            {items.map((item, index) => {
              const linkStyles = `${styles.link} ${
                item.active && styles.active
              }`;
              return (
                <li key={index} className={styles.navItem}>
                  {item.href ? (
                    <a href={item.href} className={linkStyles}>
                      {item.label}
                    </a>
                  ) : (
                    <button className={linkStyles} onClick={item.onClick}>
                      {item.label}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
      <div className={styles.sidenavMobile}>
        <nav className={styles.nav}>
          <ul className={styles.navList}>
            {items.map((item, index) => {
              return (
                <li key={index} className={styles.navItem}>
                  <Chip
                    label={item.label}
                    onClick={item.onClick}
                    href={item.href}
                    active={item.active}
                  />
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
      <main className={styles.content}>{children}</main>
    </div>
  );
};

export default SidenavLayout;
