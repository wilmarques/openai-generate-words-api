import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [results, setResults] = useState([]);

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
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

      setResults(data);

//       const answers = data.result[0].split('\n').map((r) => {
// return r;
//       });
//       setResults(answers);

      // const newResults = [...results, data.result];

      // setResults(newResults);
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
          {JSON.stringify(results)}
        </div>
      </main>
    </div>
  );
}
