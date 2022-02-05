import styles from "./Tutorial.module.css"

const Tutorial = () => (
  <>
    <h3>
      <strong>SLAM</strong> is a procedural, stack-based programming language
      inspired by Forth and Lisp.
    </h3>

    <p>
      In the core of every SLAM program, there is an implied, global stack of
      strongly and dynamically typed values. A SLAM program consists of a sequence
      of <i>words</i> that when evaluated, can consume and produce values from/to
      the stack. New words can be defined with the <i>define</i> builtin word.
    </p>

    <p>
      Just like in Forth, good SLAM words are short and succinct in their definition. Words
      should not leave extra values on the stack to avoid issues later on.
    </p>

    <p>
      <i>Phrases</i>, roughly equal to Lisp&apos;s quoted S-expressions, are a sequence
      of words that are not immediately evaluated when encountered, but instead put on
      the stack for later manipulation. Phrases can be used to implement strings or homogenous
      list structures. Phrases are also the core of conditional expressions, where branches
      of code are only evaluated when a condition is met.
    </p>

    <p>
      Some useful SLAM words include:
    </p>

    <div className={styles.quote}>
      <pre>+</pre>
      <p>Consume two numerical values and push their sum to the stack.</p>
    </div>

    <div className={styles.quote}>
      <pre>dup</pre>
      <p>Duplicate the top value of the stack.</p>
    </div>

    <div className={styles.quote}>
      <pre>.</pre>
      <p>Consume one value and print its string representation to the output.</p>
    </div>

    <div className={styles.quote}>
      <pre>cond</pre>
      <p>Consume three values (phrase2, phrase1, bool) from the stack. If bool is true,
        evaluate phrase1, otherwise evaluate phrase2.
      </p>
    </div>

    <p>
      See the examples above for more!
    </p>
  </>
)


export default Tutorial