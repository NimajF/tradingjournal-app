"use client";

import { usePathname } from "next/navigation";
import styles from "./not-found.module.css";

// The broken link, written up as a losing trade: the URL the visitor asked
// for stands in for the symbol, so the joke also tells them what failed.
export default function TradeEntry() {
  const path = usePathname();

  return (
    <figure className={styles.entry} aria-label="Journal entry for this page">
      <div className={styles.entryRow}>
        <span className={styles.chip}>
          <span className={styles.chipDot} aria-hidden="true" />
          Loss
        </span>
        <span className={styles.symbol} title={path}>
          {path}
        </span>
        <span className={styles.pnl}>−$404.00</span>
      </div>
      <figcaption className={styles.note}>
        Chased a link that never printed.
      </figcaption>
    </figure>
  );
}
