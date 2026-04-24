/**
 * RoleHierarchy
 * Horizontal chain of 6 roles connected by arrows.
 *
 * Props
 *   roles  Array<{ label: string; iconPng: string }>
 */

import React from "react";

/* Navy tint applied to every icon PNG via CSS filter */
const ICON_TINT =
  "brightness(0) saturate(100%) invert(13%) sepia(40%) saturate(900%) hue-rotate(210deg) brightness(80%)";

const styles = {
  /* Outer wrapper: horizontal scroll on mobile */
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflowX: "auto",
    /* Hide scrollbar visually but keep it functional */
    scrollbarWidth: "none",      /* Firefox */
    msOverflowStyle: "none",    /* IE/Edge */
    width: "100%",
    padding: "8px 0",
  },

  /* Inner track — never wraps */
  track: {
    display: "flex",
    alignItems: "center",
    flexWrap: "nowrap",
    /* Breathing room so the last label isn't clipped on mobile */
    paddingLeft: 4,
    paddingRight: 4,
  },

  /* Each role: circle + label, stacked vertically */
  role: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flexShrink: 0,
  },

  /* 64px lavender circle */
  circle: {
    width: 64,
    height: 64,
    borderRadius: "50%",
    backgroundColor: "#E8E6F5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  /* PNG icon — tinted navy */
  icon: {
    width: 28,
    height: 28,
    objectFit: "contain",
    filter: ICON_TINT,
    display: "block",
  },

  /* Role label */
  label: {
    marginTop: 10,
    fontSize: 13,
    lineHeight: 1.35,
    color: "#15113A",
    textAlign: "center",
    fontFamily:
      "'Source Sans 3', 'Source Sans Pro', system-ui, -apple-system, sans-serif",
    fontWeight: 400,
    maxWidth: 72,
    /* Allow two lines but prevent runaway wrapping */
    wordBreak: "break-word",
  },

  /* Arrow between roles */
  arrow: {
    flexShrink: 0,
    marginLeft: 16,
    marginRight: 16,
    /* Align with the circle centres — nudge up by half the label area */
    marginBottom: 34,
    fontSize: 18,
    color: "#B3B3B3",
    lineHeight: 1,
    userSelect: "none",
  },
};

export default function RoleHierarchy({ roles = [] }) {
  return (
    <div style={styles.root}>
      <div style={styles.track}>
        {roles.map((role, i) => (
          <React.Fragment key={role.label}>
            {/* Arrow before every role except the first */}
            {i > 0 && (
              <span style={styles.arrow} aria-hidden="true">
                →
              </span>
            )}

            <div style={styles.role}>
              <div style={styles.circle}>
                <img
                  src={role.iconPng}
                  alt={role.label}
                  style={styles.icon}
                />
              </div>
              <span style={styles.label}>{role.label}</span>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
