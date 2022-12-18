import styles from "../../../styles/Button.module.css";
export function Button({ message }: { message: string }) {
  return (
    <button
      onClick={() => {
        console.log(message);
      }}
      className={styles.container}
    >
      {message}
    </button>
  );
}
