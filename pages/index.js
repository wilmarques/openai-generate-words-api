import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [results, setResults] = useState([]);

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate_random_word", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }

      const newResults = [...results, data.result];

      setResults(newResults);
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>Guess Word API</title>
      </Head>

      <main className={styles.main}>
        <h3>Generate a random Word</h3>
        <input type="submit" value="Generate word" onClick={onSubmit} />
        <div className={styles.result}>
          <ul>
            {results.map((result) => (
              <li>{result}</li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
