import { ButtonLink } from "./Button";
import styles from "./FeaturedSection.module.css";
import Heading from "./Heading";

const FeaturedSection = ({ title = "Destacados", items = [] }) => {
  const isGrouped = Array.isArray(items) && items[0]?.items;

  if (!items || items.length === 0) return null;

  return (
    <section>
      <Heading as="h2">{title}</Heading>
      {isGrouped ? (
        items.map((section) => (
          <div key={section.title}>
            <Heading as="h3" className={styles.featuredTitle}>
              {section.title}
            </Heading>
            <div className={styles.featuredList}>
              {section.items.map((item) =>
                item.url ? (
                  <ButtonLink
                    key={item.id}
                    href={item.url}
                    className={styles.featuredItem}
                  >
                    <Heading as="h4">{item.title || item.name}</Heading>
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.title || item.name}
                        className={styles.featuredImage}
                      />
                    )}
                    {item.description && (
                      <p className={styles.featuredDescription}>
                        {item.description}
                      </p>
                    )}
                  </ButtonLink>
                ) : (
                  <div key={item.id} className={styles.featuredItem}>
                    <Heading as="h4">{item.title || item.name}</Heading>
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.title || item.name}
                        className={styles.featuredImage}
                      />
                    )}
                    {item.description && (
                      <p className={styles.featuredDescription}>
                        {item.description}
                      </p>
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        ))
      ) : (
        <div className={styles.featuredList}>
          {items.map((item) =>
            item.url ? (
              <ButtonLink
                key={item.id}
                href={item.url}
                className={styles.featuredItem}
              >
                <Heading as="h3">{item.title || item.name}</Heading>
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.title || item.name}
                    className={styles.featuredImage}
                  />
                )}
                {item.description && (
                  <p className={styles.featuredDescription}>
                    {item.description}
                  </p>
                )}
              </ButtonLink>
            ) : (
              <div key={item.id} className={styles.featuredItem}>
                <Heading as="h3">{item.title || item.name}</Heading>
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.title || item.name}
                    className={styles.featuredImage}
                  />
                )}
                {item.description && (
                  <p className={styles.featuredDescription}>
                    {item.description}
                  </p>
                )}
              </div>
            )
          )}
        </div>
      )}
    </section>
  );
};

export default FeaturedSection;
