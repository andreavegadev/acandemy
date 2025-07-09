import styles from "./Breadcrumbs.module.css";
import { IconButton } from "./Button";

const Breadcrumbs = ({ items }) => {
  return (
    <>
      <nav className={styles.breadcrumbsDesktop} aria-label="Breadcrumb">
        <ul className={styles.list}>
          {items.map((item, index) => {
            return (
              <li key={index} className={styles.item}>
                {item.current ? (
                  <span className={styles.text} aria-current="page">
                    {item.label}
                  </span>
                ) : item.href ? (
                  <a href={item.href} className={styles.link}>
                    {item.label}
                  </a>
                ) : (
                  <button
                    role="link"
                    className={styles.link}
                    onClick={item.onClick}
                    aria-label={item.label}
                  >
                    {item.label}
                  </button>
                )}

                {!item.current && (
                  <span className={styles.separator} aria-hidden="true">
                    /
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
      <div className={styles.breadcrumbsMobile} aria-label="Breadcrumb">
        <IconButton
          href={items[items.length - 2].href}
          onClick={items[items.length - 2].onClick}
          aria-label="Volver"
          bleedLeft
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="inherit"
          >
            <g data-name="Layer 2">
              <g data-name="arrow-back">
                <rect
                  width="24"
                  height="24"
                  transform="rotate(90 12 12)"
                  opacity="0"
                ></rect>
                <path d="M19 11H7.14l3.63-4.36a1 1 0 1 0-1.54-1.28l-5 6a1.19 1.19 0 0 0-.09.15c0 .05 0 .08-.07.13A1 1 0 0 0 4 12a1 1 0 0 0 .07.36c0 .05 0 .08.07.13a1.19 1.19 0 0 0 .09.15l5 6A1 1 0 0 0 10 19a1 1 0 0 0 .64-.23 1 1 0 0 0 .13-1.41L7.14 13H19a1 1 0 0 0 0-2z"></path>
              </g>
            </g>
          </svg>
        </IconButton>
      </div>
    </>
  );
};

export default Breadcrumbs;
