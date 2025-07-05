import React, { useRef, useState, useEffect } from "react";
import { IconButton } from "./Button";
import styles from "./Carousel.module.css";

const Carousel = ({ children }) => {
  const carouselRef = useRef(null);
  const childRef = useRef(null);
  const gap = 16;

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollButtons = () => {
    if (!carouselRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
  };

  const scrollByChildWidth = (direction) => {
    if (!carouselRef.current || !childRef.current) return;
    const childWidth = childRef.current.offsetWidth;
    carouselRef.current.scrollBy({
      left: direction * (childWidth + gap),
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    updateScrollButtons(); // initial check

    carousel.addEventListener("scroll", updateScrollButtons);
    window.addEventListener("resize", updateScrollButtons); // <-- add this

    return () => {
      carousel.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons); // <-- and cleanup
    };
  }, []);

  return (
    <div style={{ position: "relative" }} className={styles.carouselContainer}>
      <div ref={carouselRef} className={styles.itemsContainer}>
        {React.Children.map(children, (child, index) => (
          <div
            className={`${styles.itemWrapper} 
             ${
               index === React.Children.count(children) - 1
                 ? styles.lastItemWrapper
                 : ""
             }`}
            ref={index === 0 ? childRef : undefined}
          >
            {React.cloneElement(child, {
              className: `${child.props.className || ""} ${
                styles.mobilePeekItem
              }`,
            })}
          </div>
        ))}
      </div>
      {(canScrollLeft || canScrollRight) && (
        <div>
          <IconButton
            onClick={() => scrollByChildWidth(-1)}
            disabled={!canScrollLeft}
            style={{
              position: "absolute",
              left: 0,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 1,
              opacity: canScrollLeft ? 1 : 0.3,
              cursor: canScrollLeft ? "pointer" : "default",
            }}
          >
            ◀
          </IconButton>
          <IconButton
            onClick={() => scrollByChildWidth(1)}
            disabled={!canScrollRight}
            style={{
              position: "absolute",
              right: 0,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 1,
              opacity: canScrollRight ? 1 : 0.3,
              cursor: canScrollRight ? "pointer" : "default",
            }}
          >
            ▶
          </IconButton>
        </div>
      )}
    </div>
  );
};

export default Carousel;
