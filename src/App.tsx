import styles from "./App.module.css"
import Editor from "./Editor"
import Tutorial from "./Tutorial"
import icon from "./favicon.png"

const App = () => {
  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.iconRow}>
          <img src={icon} />
          <strong>SLAM</strong>
        </div>
        <div className={styles.sloganRow}>
          <small>A Mere Stack Language</small>
        </div>
      </header>
      <div className={styles.editor}><Editor /></div>
      <div className={styles.tutorial}><Tutorial /></div>
    </div>
  )
}

export default App
