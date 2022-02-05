import { useState } from "react"

const Tutorial = () => {
  const [collapsed, setCollapsed] = useState(true)

  if (collapsed) {
    return <button onClick={() => setCollapsed(false)}>SLAM tutorial ▼</button>
  }

  return (
    <>
      <button onClick={() => setCollapsed(true)}>SLAM tutorial ▲</button>

      <h3>
        <strong>SLAM</strong> is a procedural, stack-based programming language
        inspired by Forth and Lisp.
      </h3>

      <p>
        In the core of every SLAM program, there is an implied, global stack of
        strongly and dynamically typed values. A SLAM program consists of a sequence
        of <i>words</i> that when evaluated, can consume and produce values from/to
        the stack.
      </p>

      <p>
        <i>Phrases</i>, roughly equal to Lisp&apos;s quoted S-expressions, are a sequence
        of words that are not immediately evaluated when encountered, but instead put on the stack for later
        manipulation. Phrases can be used to implement strings or homogenous list structures. Phrases
        are also the core of conditional expressions, where branches of code are only evaluated
        when a condition is met.
      </p>
    </>
  )
}

export default Tutorial