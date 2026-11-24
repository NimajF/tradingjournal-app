import Link from "next/link";
import styles from "./_not-found/not-found.module.css";
import NotFoundTitle from "./_not-found/NotFoundTitle";
import TradeEntry from "./_not-found/TradeEntry";

export default function NotFound() {
  return (
    <div className={styles.overlay}>
      <NotFoundTitle />
      <main className={styles.content}>
        <p className={styles.code}>404</p>
        <h1 className={styles.title}>Page not found</h1>
        <p className={styles.lede}>
          The link you followed is broken, or the page was moved or deleted.
        </p>
        <nav className={styles.actions} aria-label="Leave this page">
          <Link href="/journals" className={`${styles.btn} ${styles.primary}`}>
            Back to journal
          </Link>
          <Link href="/" className={`${styles.btn} ${styles.secondary}`}>
            Go home
          </Link>
        </nav>
        <TradeEntry />
      </main>
    </div>
  );
}
