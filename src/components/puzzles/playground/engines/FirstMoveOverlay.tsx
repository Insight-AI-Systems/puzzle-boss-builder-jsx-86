
import React from "react";

type FirstMoveOverlayProps = {
  show: boolean;
  onFirstMove: () => void;
};

const FirstMoveOverlay: React.FC<FirstMoveOverlayProps> = ({ show, onFirstMove }) =>
  show ? (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 9,
        background: "rgba(0,0,0,0)",
        cursor: "pointer",
      }}
      tabIndex={0}
      role="button"
      aria-label="Start Puzzle Timer"
      onPointerDown={onFirstMove}
      data-testid="first-move-overlay"
    />
  ) : null;

export default FirstMoveOverlay;
