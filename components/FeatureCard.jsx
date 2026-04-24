/**
 * FeatureCard
 * Vertical feature callout: icon circle → heading → body.
 * Matches the "Self-service setup" card visual style.
 *
 * Props
 *   iconPng   string   path to PNG icon
 *   heading   string   e.g. "Self-service setup"
 *   body      string   descriptive sentence
 */

import React from "react";

/* Navy tint applied to icon PNG — same filter as RoleHierarchy */
const ICON_TINT =
  "brightness(0) saturate(100%) invert(13%) sepia(40%) saturate(900%) hue-rotate(210deg) brightness(80%)";

const styles = {
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    maxWidth: 360,
  },

  /* 42px lavender circle */
  circle: {
    width: 42,
    height: 42,
    borderRadius: "50%",
    backgroundColor: "#E8E6F5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  /* PNG icon inside the circle — placeholder size until real icon is supplied */
  icon: {
    width: 20,
    height: 20,
    objectFit: "contain",
    filter: ICON_TINT,
    display: "block",
  },

  heading: {
    marginTop: 24,
    fontSize: 17,
    fontWeight: 600,
    lineHeight: 1.3,
    color: "#15113A",
    fontFamily:
      "'Source Sans 3', 'Source Sans Pro', system-ui, -apple-system, sans-serif",
  },

  body: {
    marginTop: 12,
    fontSize: 15,
    fontWeight: 400,
    lineHeight: 1.6,
    color: "#555555",
    fontFamily:
      "'Source Sans 3', 'Source Sans Pro', system-ui, -apple-system, sans-serif",
  },
};

export default function FeatureCard({ iconPng, heading, body }) {
  return (
    <div style={styles.root}>
      <div style={styles.circle}>
        {iconPng ? (
          <img src={iconPng} alt="" aria-hidden="true" style={styles.icon} />
        ) : (
          /* Visible placeholder when no icon is provided yet */
          <span
            style={{
              width: 20,
              height: 20,
              display: "block",
              borderRadius: 4,
              backgroundColor: "#C5C0E8",
            }}
          />
        )}
      </div>

      {heading && <p style={styles.heading}>{heading}</p>}
      {body    && <p style={styles.body}>{body}</p>}
    </div>
  );
}
