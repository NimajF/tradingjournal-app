import {
  BarChart3,
  BookOpen,
  FilePenLine,
  Globe,
  Lock,
  TrendingUp,
} from "lucide-react";

// Icons used in the feature cards
const icons = {
  book: <BookOpen size={20} strokeWidth={1.75} />,
  chart: <BarChart3 size={20} strokeWidth={1.75} />,
  lock: <Lock size={20} strokeWidth={1.75} />,
  trending: <TrendingUp size={20} strokeWidth={1.75} />,
  edit: <FilePenLine size={20} strokeWidth={1.75} />,
  globe: <Globe size={20} strokeWidth={1.75} />,
};

// Feature cards shown on the homepage
export const features = [
  {
    icon: icons.book,
    title: "Trade Journal",
    description:
      "Log every trade with full context — entry, exit, size, notes, and tags. Build an honest record of your trading history.",
  },
  {
    icon: icons.edit,
    title: "Analysis Posts",
    description:
      "Write in-depth analysis with a rich text editor. Add images, structure your thesis, and document lessons learned.",
  },
  {
    icon: icons.lock,
    title: "Private by Default",
    description:
      "Your journal is completely yours. Share only the specific analysis posts you choose to make public.",
  },
  {
    icon: icons.trending,
    title: "Performance Stats",
    description:
      "Track win rate, average returns, and streaks over time. Turn raw trade data into actionable insight.",
  },
  {
    icon: icons.chart,
    title: "Visual Analytics",
    description:
      "Clean charts that surface patterns in your trading — by ticker, time of day, setup type, and more.",
  },
  {
    icon: icons.globe,
    title: "Public Hub",
    description:
      "Publish your best analysis to the community. Build a reputation backed by your actual track record.",
  },
];
