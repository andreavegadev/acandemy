import React, { useRef, useState, useEffect } from "react";
import { IconButton } from "./Button";
import styles from "./Carousel.module.css";

const Carousel = ({ children }) => {
  const carouselRef = useRef(null);
  const childRef = useRef(null);
  const gap = 16; // adjust to your design gap

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollButtons = () => {
    if (!carouselRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;

    setCanScrollLeft(scrollLeft > 0);
    // Allow a small margin for floating point inaccuracies
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
    return () => carousel.removeEventListener("scroll", updateScrollButtons);
  }, []);

  return (
    <div style={{ position: "relative" }} className={styles.carouselContainer}>
      <div ref={carouselRef} className={styles.itemsContainer}>
        {React.Children.map(children, (child, index) =>
          React.cloneElement(child, {
            className: `${child.props.className || ""} ${
              styles.mobilePeekItem
            }`,
            ref: index === 0 ? childRef : undefined,
          })
        )}
      </div>
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
  );
};

export default Carousel;
