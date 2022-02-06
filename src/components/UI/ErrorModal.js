import styles from "./ErrorModal.module.css";

const ErrorModal = (props) => {
  return (
    <div className={styles.modal}>
      <header className={styles.header}>{props.title}</header>
      <p>{props.message}</p>
      <button onClick={props.onRemoveError} className={styles.button}>
        OK
      </button>
    </div>
  );
};

export default ErrorModal;
