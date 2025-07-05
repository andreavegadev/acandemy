import React, { useRef, useState, useEffect } from "react";
import { IconButton } from "./Button";
import styles from "./Carousel.module.css";
import { Inline } from "./LayoutUtilities";

const Carousel = ({
  children,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
}) => {
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
    <section
      className={styles.carouselContainer}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      aria-roledescription="Carrusel"
    >
      <ul ref={carouselRef} className={styles.itemsContainer}>
        {React.Children.map(children, (child, index) => (
          <li
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
          </li>
        ))}
      </ul>
      {(canScrollLeft || canScrollRight) && (
        <Inline gap={16} fullWidth justify="flex-end">
          <IconButton
            onClick={() => scrollByChildWidth(-1)}
            disabled={!canScrollLeft}
            aria-label={"Página anterior"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 24 24"
              class="eva eva-chevron-left-outline"
              fill="inherit"
            >
              <g data-name="Layer 2">
                <g data-name="chevron-left">
                  <rect
                    width="24"
                    height="24"
                    transform="rotate(90 12 12)"
                    opacity="0"
                  ></rect>
                  <path d="M13.36 17a1 1 0 0 1-.72-.31l-3.86-4a1 1 0 0 1 0-1.4l4-4a1 1 0 1 1 1.42 1.42L10.9 12l3.18 3.3a1 1 0 0 1 0 1.41 1 1 0 0 1-.72.29z"></path>
                </g>
              </g>
            </svg>
          </IconButton>
          <IconButton
            bleedRight
            onClick={() => scrollByChildWidth(1)}
            disabled={!canScrollRight}
            aria-label={"Página siguiente"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 24 24"
              class="eva eva-chevron-right-outline"
              fill="inherit"
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
          </IconButton>
        </Inline>
      )}
    </section>
  );
};

export default Carousel;
