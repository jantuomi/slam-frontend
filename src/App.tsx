import { useExamples } from "./api"
import styles from "./App.module.css"
import Editor from "./Editor"
import Tutorial from "./Tutorial"
import icon from "./favicon.png"

const App = () => {
  const examples = useExamples()

  const renderExamples = () => {
    switch (examples.type) {
      case "not_yet_requested":
      case "loading":
        return <div>Loading examples...</div>
      case "failed":
        return <div className={styles.error}>
          An unexpected error occurred while loading examples. See console for details.
        </div>
      case "success":
        return examples.data.map((example) =>
          <div key={example.id}>{example.title}</div>,
        )
    }
  }

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
      <div className={styles.examples}>
        {renderExamples()}
      </div>
      <div className={styles.editor}><Editor /></div>
      <div className={styles.tutorial}><Tutorial /></div>
    </div>
  )
}

export default App
