import React from 'react';
import styles from './CustomCheckbox.module.css';

interface CustomCheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string | React.ReactNode;
}

export default function CustomCheckbox({ label, className, style, checked, ...props }: CustomCheckboxProps) {
  const isControlled = checked !== undefined || 'checked' in props;
  const inputProps: React.InputHTMLAttributes<HTMLInputElement> = { ...props };
  if (isControlled) {
    inputProps.checked = Boolean(checked);
  }

  return (
    <label className={`${styles.checkbox} ${className || ''}`} style={style}>
      <input type="checkbox" {...inputProps} />
      <div className={styles.checkmark}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <g
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect
              x="1.5"
              y="1.5"
              width="21"
              height="21"
              rx="5"
              ry="5"
              strokeWidth="3"
            ></rect>
            <polyline points="7 10 12 16 22 2" strokeWidth="4"></polyline>
          </g>
        </svg>
        {label && <span>{label}</span>}
      </div>
    </label>
  );
}
