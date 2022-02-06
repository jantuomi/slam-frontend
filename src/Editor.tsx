import AceEditor from "react-ace"
import "ace-builds/src-noconflict/mode-java"
import "ace-builds/src-noconflict/theme-github"
import { useState } from "react"
import styles from "./Editor.module.css"
import { SubmitResult, submitSource, useExamples } from "./api"
import Select from "react-select"

const defaultSourceText = `define times2
    dup +
    ;

2 times2 .
-- prints 4
`

const Editor = () => {
  const examples = useExamples()
  const [sourceText, setSourceText] = useState(defaultSourceText)
  const [result, setResult] = useState<SubmitResult>({ type: "not_yet_requested" })
  const onChange = setSourceText

  const executeCode = async (text: string) => {
    const result = await submitSource(text)
    setResult(result)
  }

  const renderExamples = () => {
    switch (examples.type) {
      case "not_yet_requested":
      case "loading":
        return <div>Loading examples...</div>
      case "failed":
        return <div className={styles.error}>
          An unexpected error occurred while loading examples. See console for details.
        </div>
      case "success": {
        const options = examples.data.map(example => ({ value: example.content, label: example.title }))
        const customStyles = {
          option: (styles: any) => ({
            ...styles,
            cursor: "pointer",
          }),
          control: (styles: any) => ({
            ...styles,
            cursor: "pointer",
          }),
        }
        return (
          <Select
            placeholder="Pick an example code snippet..."
            options={options}
            onChange={(val) => { setSourceText(val?.value as string) }}
            styles={customStyles}
          />
        )
      }
    }
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
      case "success": {
        const text = `Output:\n${result.data}`
        return (
          <AceEditor
            mode=""
            theme="github"
            onChange={() => undefined}
            value={text}
            name="results"
            editorProps={{ $blockScrolling: true }}
            width="100%"
            minLines={10}
            maxLines={10}
            fontSize={16}
            readOnly
          />
        )
      }
    }
  }

  return (
    <>
      <div className={styles.examples}>
        {renderExamples()}
      </div>
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
