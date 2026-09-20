import React, { useState, useEffect, useRef } from "react";

export interface CustomSelectOption {
  value: string;
  label: string;
  dotColor?: string;
}

interface CustomSelectProps {
  value: string;
  options: CustomSelectOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
  disabledLabel?: string;
  placeholder?: string;
  maxWidth?: string;
  style?: React.CSSProperties;
}

export default function CustomSelect({
  value,
  options,
  onChange,
  disabled = false,
  disabledLabel,
  placeholder,
  maxWidth = "260px",
  style = {},
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (disabled) {
    return (
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          padding: "7px 12px",
          borderRadius: "8px",
          backgroundColor: "#f3f4f6",
          border: "1px solid #e5e7eb",
          fontSize: "0.85rem",
          fontWeight: 400,
          color: "#6b7280",
          ...style,
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
        {disabledLabel || `Locked (${value})`}
      </div>
    );
  }

  const selectedOption = options.find((o) => o.value === value);
  const displayLabel = selectedOption ? selectedOption.label : value || placeholder || "Select option";

  return (
    <div ref={containerRef} style={{ position: "relative", display: "inline-block", width: "100%", maxWidth, ...style }}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "100%",
          padding: "8px 12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#ffffff",
          border: "1px solid #d1d5db",
          borderRadius: "8px",
          cursor: "pointer",
          boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
          transition: "all 0.15s ease-in-out",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {selectedOption?.dotColor && (
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: selectedOption.dotColor,
                display: "inline-block",
              }}
            />
          )}
          <span style={{ fontSize: "0.85rem", fontWeight: 400, color: "#111827" }}>
            {displayLabel}
          </span>
        </div>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#6b7280"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            zIndex: 100,
            backgroundColor: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "10px",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
            padding: "6px",
            display: "flex",
            flexDirection: "column",
            gap: "2px",
          }}
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              style={{
                width: "100%",
                padding: "8px 10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderRadius: "6px",
                border: "none",
                backgroundColor: "transparent",
                cursor: "pointer",
                textAlign: "left",
                transition: "background-color 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f3f4f6")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {opt.dotColor && (
                  <span
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      backgroundColor: opt.dotColor,
                    }}
                  />
                )}
                <span style={{ fontSize: "0.85rem", fontWeight: 400, color: "#1f2937" }}>
                  {opt.label}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
