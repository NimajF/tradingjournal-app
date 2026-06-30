export const RESULT_MAP = {
  win: {
    icon: "✓",
    iconBg: "bg-profit-muted",
    label: "TP",
    dotClass: "bg-profit",
    badgeBg: "bg-profit-muted",
    badgeText: "text-profit-muted-fg",
  },
  loss: {
    icon: "✗",
    iconBg: "bg-loss-muted",
    label: "SL",
    dotClass: "bg-loss",
    badgeBg: "bg-loss-muted",
    badgeText: "text-loss-muted-fg",
  },
  breakeven: {
    icon: "—",
    iconBg: "bg-surface-alt",
    label: "BE",
    dotClass: "bg-muted-fg",
    badgeBg: "bg-surface-alt",
    badgeText: "text-muted-fg",
  },
} as const;
