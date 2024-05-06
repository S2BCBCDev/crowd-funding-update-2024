import styles from "./page.module.css";
import { ethers } from 'ethers';
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
