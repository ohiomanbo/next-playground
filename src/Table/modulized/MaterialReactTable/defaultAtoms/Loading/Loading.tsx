"use client";

import { Box, CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";

const FadeLoadingOverlay = ({ isLoading, top, height }: { top: string; height: string; isLoading: boolean }) => {
  const [shouldRender, setShouldRender] = useState(isLoading);

  useEffect(() => {
    if (isLoading) setShouldRender(true);
  }, [isLoading]);

  const handleTransitionEnd = () => {
    if (!isLoading) setShouldRender(false);
  };

  return shouldRender ? (
    <Box
      sx={{
        position: "absolute",
        height,
        top: top,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1,
        opacity: isLoading ? 1 : 0,
        transition: "opacity 300ms ease-in-out",
        pointerEvents: isLoading ? "auto" : "none",
      }}
      onTransitionEnd={handleTransitionEnd}
    >
      <CircularProgress />
    </Box>
  ) : null;
};

export default FadeLoadingOverlay;
