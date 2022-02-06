import styles from "./ErrorModal.module.css";

const Backdrop = (props) => {
  return (
    <div onClick={props.onRemoveError} className={styles.backdrop}>
      {props.children}
    </div>
  );
};

export default Backdrop;
