import AceEditor from "react-ace"
import "ace-builds/src-noconflict/mode-java"
import "ace-builds/src-noconflict/theme-github"
import { useEffect, useState } from "react"
import styles from "./Editor.module.css"
import { useExamples, useSubmitSource } from "./api"
import Select from "react-select"

const defaultSourceText = `define times2
    dup +
    ;

3 times2 .
-- prints 6
`

const Editor = () => {
  const examples = useExamples()
  const [sourceText, setSourceText] = useState(defaultSourceText)
  const { result, submitSource } = useSubmitSource()
  const [sourceDirty, setSourceDirty] = useState(false)
  const onChange = (text: string) => {
    setSourceText(text)
    setSourceDirty(true)
  }

  const renderExamples = () => {
    switch (examples.type) {
      case "not_yet_requested":
      case "loading":
        return <div id="examples-loading">Loading examples...</div>
      case "failed":
        return <div className={styles.error}>
          An unexpected error occurred while loading examples. See console for details.
        </div>
      case "success": {
        const options = examples.data.examples.map(example => ({
          value: example.content, label: example.title,
        }))
        const customStyles = {
          option: (styles: any) => ({
            ...styles,
            cursor: "pointer",
            color: "#282c34",
          }),
          control: (styles: any) => ({
            ...styles,
            cursor: "pointer",
          }),
        }
        return (
          <Select
            id="example-select"
            placeholder="Pick an example code snippet..."
            options={options}
            onChange={(val) => {
              let ok = true
              if (sourceDirty) {
                ok = window.confirm("Loading an example will discard your changes. Proceed?")
              }
              if (ok) {
                setSourceText(val?.value as string)
                setSourceDirty(false)
              }
            }}
            styles={customStyles}
          />
        )
      }
    }
  }

  const renderResults = () => {
    switch (result.type) {
      case "not_yet_requested":
        return null
      case "loading":
        return (
          <div>
            Running...
          </div>
        )
      case "failed":
        return (
          <div className={styles.error}>
            Failed to run code on the server. See console for details.
          </div>
        )
      case "success": {
        const apiTimeMillis = (result.data.apiTime / 1000).toFixed(1)
        const executionTimeMillis = (result.data.executionTime / 1000).toFixed(1)
        const roundtripTime = (result.data.roundtripTime).toFixed(1)
        const text = `Output:\n${result.data.result}\nTotal roundtrip time: ${roundtripTime} ms\nServer processing time: ${apiTimeMillis} ms\nExecution time: ${executionTimeMillis} ms`
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

  const resetSourceEditor = () => {
    setSourceText("")
  }

  // reset source editor content, used in e2e tests
  useEffect(() => {
    window.addEventListener("resetSourceEditor", resetSourceEditor)

    return () => {
      window.removeEventListener("resetSourceEditor", resetSourceEditor)
    }
  }, [])

  return (
    <>
      <div className={styles.examples}>
        {renderExamples()}
      </div>
      <div id="source-editor">
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
      </div>
      <button id="run-button" className={styles.runButton} onClick={() => submitSource(sourceText)}>
        ▶️ Run code on server
      </button>
      <div id="results-editor" className={styles.results}>
        {renderResults()}
      </div>
    </>
  )
}

export default Editor
