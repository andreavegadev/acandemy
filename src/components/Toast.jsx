import { IconButton } from "./Button";
import styles from "./Toast.module.css";

const Toast = ({ message, onClose, action }) => {
  return (
    <div className={styles.toast}>
      <div className={styles.toastContent}>
        {message}
        {action && (
          <a className={styles.toastAction} href={action.href}>
            {action.label || "Action"}
          </a>
        )}
      </div>
      <IconButton onClick={onClose} aria-label="Close">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="inherit"
        >
          <g data-name="Layer 2">
            <g data-name="close">
              <rect
                width="24"
                height="24"
                transform="rotate(180 12 12)"
                opacity="0"
              ></rect>
              <path d="M13.41 12l4.3-4.29a1 1 0 1 0-1.42-1.42L12 10.59l-4.29-4.3a1 1 0 0 0-1.42 1.42l4.3 4.29-4.3 4.29a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0l4.29-4.3 4.29 4.3a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42z"></path>
            </g>
          </g>
        </svg>
      </IconButton>
    </div>
  );
};

export default Toast;
