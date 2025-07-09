import styles from "./Row.module.css";
import Heading from "./Heading";

export const Row = ({
  pretitle,
  title,
  subtitle,
  description,
  detail,
  href,
  onClick,
  tag,
  asset,
}) => {
  const Wrapper = href ? "a" : "button";
  const wrapperProps = href
    ? { href, className: styles.link }
    : { onClick, className: styles.button, type: "button" };

  return (
    <li>
      <Wrapper
        {...wrapperProps}
        className={`${styles.row} ${wrapperProps.className}`}
      >
        {asset && <img src={asset} alt={title} className={styles.asset} />}

        <div className={styles.content}>
          {tag && <span className={styles.tag}>{tag}</span>}
          <div className={styles.textContent}>
            {pretitle && <p className={styles.pretitle}>{pretitle}</p>}
            <Heading as="h3" className={styles.title}>
              {title}
            </Heading>
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
            {description && <p className={styles.description}>{description}</p>}
          </div>
        </div>

        <div className={styles.rightContent}>
          <span className={styles.detail}>{detail}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            className="eva eva-chevron-right-outline"
            fill="var(--neutral60)"
          >
            <g data-name="Layer 2">
              <g data-name="chevron-right">
                <rect
                  width="24"
                  height="24"
                  transform="rotate(-90 12 12)"
                  opacity="0"
                ></rect>
                <path d="M10.5 17a1 1 0 0 1-.71-.29 1 1 0 0 1 0-1.42L13.1 12 9.92 8.69a1 1 0 0 1 0-1.41 1 1 0 0 1 1.42 0l3.86 4a1 1 0 0 1 0 1.4l-4 4a1 1 0 0 1-.7.32z"></path>
              </g>
            </g>
          </svg>
        </div>
      </Wrapper>
    </li>
  );
};

export const RowList = ({ children, as: Tag = "ul" }) => {
  return <Tag className={styles.rowList}>{children}</Tag>;
};
