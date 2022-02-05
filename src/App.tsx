import { useSnippets } from "./api"
import styles from "./App.module.css"
import icon from "./favicon.png"

const App = () => {
  const snippets = useSnippets()

  const renderSnippets = () => {
    if (snippets.type === "failed") {
      return <div className={styles.error}>
        Unexpected error loading snippets. See console for details.
      </div>
    }

    if (snippets.type === "loading") {
      return <div>Loading snippets...</div>
    }

    return snippets.data.map((snippet) =>
      <div key={snippet.id}>{snippet.title}</div>,
    )
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
      <div>
        {renderSnippets()}
      </div>
    </div>
  )
}

export default App
