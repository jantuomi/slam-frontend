import AceEditor from "react-ace"
import "ace-builds/src-noconflict/mode-java"
import "ace-builds/src-noconflict/theme-github"
import { useState } from "react"
import styles from "./Editor.module.css"
import { APIResult, submitSource } from "./api"

const Editor = () => {
  const [sourceText, setSourceText] = useState("")
  const [result, setResult] = useState<APIResult<string, Error>>({ type: "not_yet_requested" })
  const onChange = setSourceText

  const executeCode = async (text: string) => {
    const result = await submitSource(text)
    setResult(result)
  }

  const renderResults = () => {
    switch (result.type) {
      case "not_yet_requested":
      case "loading":
        return null
      case "failed":
        return (
          <div className={styles.error}>
            Failed to run code on the server. See console for details.
          </div>
        )
      case "success":
        return (
          <AceEditor
            mode=""
            theme="github"
            onChange={() => undefined}
            value={result.data}
            name="results"
            editorProps={{ $blockScrolling: true }}
            width="100%"
            fontSize={16}
            readOnly
          />
        )
    }
  }

  return (
    <>
      <AceEditor
        mode=""
        theme="github"
        onChange={onChange}
        value={sourceText}
        name="editor"
        editorProps={{ $blockScrolling: true }}
        width="100%"
        fontSize={16}
      />
      <button className={styles.runButton} onClick={() => executeCode(sourceText)}>
        ▶️ Run code on server
      </button>
      <div className={styles.results}>
        {renderResults()}
      </div>
    </>
  )
}

export default Editor
