"use client";

import {
  forwardRef,
  useId,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import Box from "@mui/material/Box";
import Paper, { type PaperProps } from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import { meridian } from "@/styles/theme";

export type MetricDeltaDirection = "up" | "down" | "neutral";

export type MetricDelta = {
  value: number | string;
  direction?: MetricDeltaDirection;
  label?: string;
};

export type MetricCardSize = "sm" | "md" | "lg";

export type MetricCardProps = Omit<PaperProps, "children" | "onClick"> & {
  label: string;
  value: ReactNode;
  unit?: string;
  delta?: MetricDelta;
  icon?: ReactNode;
  loading?: boolean;
  size?: MetricCardSize;
  onClick?: () => void;
};

const sizeTokens: Record<
  MetricCardSize,
  { value: string; pad: number; icon: number; gap: number }
> = {
  sm: { value: "1.375rem", pad: 2, icon: 40, gap: 1.25 },
  md: { value: "1.875rem", pad: 2.5, icon: 48, gap: 1.5 },
  lg: { value: "2.375rem", pad: 3, icon: 56, gap: 1.75 },
};

const cardSurface = {
  position: "relative" as const,
  overflow: "hidden",
  borderRadius: "16px",
  border: `1px solid ${meridian.border}`,
  background: `linear-gradient(165deg, ${meridian.surface} 0%, #f8fafc 100%)`,
  boxShadow:
    "0 1px 2px rgb(0 31 84 / 0.04), 0 8px 24px rgb(0 31 84 / 0.05)",
  transition:
    "transform 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease",
  "&::before": {
    content: '""',
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    background: `linear-gradient(180deg, ${meridian.brandPrimary} 0%, #3d6a9c 100%)`,
    opacity: 0.85,
  },
};

function resolveDeltaDirection(
  direction: MetricDeltaDirection | undefined,
  value: number | string,
): MetricDeltaDirection {
  if (direction) return direction;
  if (typeof value === "number") {
    if (value > 0) return "up";
    if (value < 0) return "down";
  }
  return "neutral";
}

function deltaColors(direction: MetricDeltaDirection) {
  switch (direction) {
    case "up":
      return { color: meridian.success, bg: "var(--success-muted)" };
    case "down":
      return { color: meridian.danger, bg: "var(--danger-muted)" };
    default:
      return { color: meridian.textSecondary, bg: meridian.muted };
  }
}

function DeltaIcon({ direction }: { direction: MetricDeltaDirection }) {
  const sx = { fontSize: 15 };
  if (direction === "up") return <TrendingUpIcon sx={sx} />;
  if (direction === "down") return <TrendingDownIcon sx={sx} />;
  return <TrendingFlatIcon sx={sx} />;
}

export const MetricCard = forwardRef<HTMLDivElement, MetricCardProps>(
  function MetricCard(
    {
      label,
      value,
      unit,
      delta,
      icon,
      loading = false,
      size = "md",
      onClick,
      sx,
      className,
      elevation = 0,
      ...paperProps
    },
    ref,
  ) {
    const tokens = sizeTokens[size];
    const interactive = Boolean(onClick);
    const labelId = useId();

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      if (!onClick) return;
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onClick();
      }
    };

    const interactiveSx = interactive
      ? {
          cursor: "pointer",
          "&:hover": {
            transform: "translateY(-2px)",
            borderColor: "rgb(0 31 84 / 0.28)",
            boxShadow:
              "0 4px 12px rgb(0 31 84 / 0.08), 0 16px 32px rgb(0 31 84 / 0.08)",
          },
          "&:focus-visible": {
            outline: `2px solid ${meridian.brandPrimary}`,
            outlineOffset: 2,
          },
        }
      : {
          cursor: "default",
          "&:hover": {
            boxShadow:
              "0 2px 8px rgb(0 31 84 / 0.06), 0 12px 28px rgb(0 31 84 / 0.06)",
          },
        };

    if (loading) {
      return (
        <Paper
          ref={ref}
          elevation={elevation}
          className={["surface-card", className].filter(Boolean).join(" ")}
          sx={{
            ...cardSurface,
            p: tokens.pad,
            ...((sx as object) ?? {}),
          }}
          {...paperProps}
        >
          <Box sx={{ display: "flex", gap: tokens.gap, alignItems: "flex-start" }}>
            {icon !== undefined && (
              <Skeleton variant="rounded" width={tokens.icon} height={tokens.icon} />
            )}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Skeleton width="42%" height={12} sx={{ mb: 1.25 }} />
              <Skeleton width="58%" height={36} sx={{ mb: 1.25 }} />
              <Skeleton width="32%" height={22} />
            </Box>
          </Box>
        </Paper>
      );
    }

    const direction = delta
      ? resolveDeltaDirection(delta.direction, delta.value)
      : null;
    const colors = direction ? deltaColors(direction) : null;

    return (
      <Paper
        ref={ref}
        elevation={elevation}
        className={["surface-card", className].filter(Boolean).join(" ")}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        role={interactive ? "button" : undefined}
        tabIndex={interactive ? 0 : undefined}
        aria-labelledby={labelId}
        sx={{
          ...cardSurface,
          p: tokens.pad,
          ...interactiveSx,
          ...((sx as object) ?? {}),
        }}
        {...paperProps}
      >
        <Box
          sx={{
            display: "flex",
            gap: tokens.gap,
            alignItems: "flex-start",
          }}
        >
          {icon != null && (
            <Box
              aria-hidden
              sx={{
                width: tokens.icon,
                height: tokens.icon,
                borderRadius: "12px",
                flexShrink: 0,
                display: "grid",
                placeItems: "center",
                background: `linear-gradient(145deg, ${meridian.muted} 0%, #e8eef5 100%)`,
                border: `1px solid rgb(0 31 84 / 0.08)`,
                color: meridian.brandPrimary,
                boxShadow: "inset 0 1px 0 rgb(255 255 255 / 0.8)",
                "& > *": { fontSize: tokens.icon * 0.42 },
              }}
            >
              {icon}
            </Box>
          )}

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              id={labelId}
              component="p"
              sx={{
                m: 0,
                mb: 1,
                fontFamily: "var(--font-ibm-plex-mono), monospace",
                fontSize: "0.6875rem",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: meridian.textSecondary,
                lineHeight: 1.3,
              }}
            >
              {label}
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "baseline",
                gap: 0.75,
                flexWrap: "wrap",
                mb: delta ? 1.25 : 0,
              }}
            >
              <Typography
                component="p"
                sx={{
                  m: 0,
                  fontSize: tokens.value,
                  fontWeight: 700,
                  lineHeight: 1.1,
                  letterSpacing: "-0.03em",
                  color: meridian.textPrimary,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {value}
              </Typography>
              {unit ? (
                <Typography
                  component="span"
                  sx={{
                    fontSize: "0.8125rem",
                    fontWeight: 500,
                    color: meridian.textSecondary,
                    letterSpacing: "0.01em",
                  }}
                >
                  {unit}
                </Typography>
              ) : null}
            </Box>

            {delta && direction && colors ? (
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.5,
                  px: 1.1,
                  py: 0.45,
                  borderRadius: "999px",
                  backgroundColor: colors.bg,
                  color: colors.color,
                  border: "1px solid currentColor",
                  borderColor: "transparent",
                  fontFamily: "var(--font-ibm-plex-mono), monospace",
                  fontSize: "0.6875rem",
                  fontWeight: 600,
                  lineHeight: 1.2,
                  letterSpacing: "0.02em",
                }}
              >
                <DeltaIcon direction={direction} />
                <Box component="span">
                  {typeof delta.value === "number" && delta.value > 0
                    ? `+${delta.value}`
                    : delta.value}
                  {delta.label ? ` ${delta.label}` : null}
                </Box>
              </Box>
            ) : null}
          </Box>
        </Box>
      </Paper>
    );
  },
);

MetricCard.displayName = "MetricCard";
