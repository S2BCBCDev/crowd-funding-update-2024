import styles from "./page.module.css";
import InteractContract from "./interact-contract";

export default function Home() {
  return (
    <main className={styles.main}>
      <div>
        <InteractContract />
      </div>
    </main>
  );
}
