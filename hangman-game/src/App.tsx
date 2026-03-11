import { useState, useEffect } from "react"
import HangmanDrawing from "./components/hangmandrawing"
import HangmanWord from "./components/hangmanword"
import Keyboard from "./components/keyboard"
import { words } from "./words"

function getRandomWord() {
  return words[Math.floor(Math.random() * words.length)]
}

function App() {
  const [wordObj, setWordObj] = useState(() => getRandomWord())
  const wordToGuess = wordObj.word.toLowerCase()

  const [guessedLetters, setGuessedLetters] = useState<string[]>([])
  const [showHintPopup, setShowHintPopup] = useState(false)

  const [round, setRound] = useState(1)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)


  const [showRestartPopup, setShowRestartPopup] = useState(false)

  const maxRounds = 5
  const maxMistakes = 6

  const incorrectLetters = guessedLetters.filter(
    letter => !wordToGuess.includes(letter)
  )

  const mistakes = incorrectLetters.length
  const isLoser = mistakes >= maxMistakes

  const isWinner = wordToGuess
    .split("")
    .every(letter => guessedLetters.includes(letter))

  const gameFinished = score > 0

  function addGuessedLetter(letter: string) {
    const lower = letter.toLowerCase()

    if (guessedLetters.includes(lower) || isLoser || isWinner || gameOver) return
    setGuessedLetters(current => [...current, lower])
  }

  function resetGame(nextRound = false) {
  setGuessedLetters([])
  setWordObj(getRandomWord())
  setShowHintPopup(false)
  setGameOver(false)

  if (nextRound) {
    setRound(r => r + 1)
  } else {
    setRound(1)
  }
}

function newMatch() {
  setRound(1)
  setScore(0)
  setGameOver(false)
  setGuessedLetters([])
  setWordObj(getRandomWord())
}


  // keyboard input
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase()

      if (!key.match(/^[a-z]$/)) return
      if (isLoser || isWinner || gameFinished) return

      event.preventDefault()
      addGuessedLetter(key)
    }

    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [guessedLetters, isLoser, isWinner, gameFinished])

  // hint popup
  useEffect(() => {
    if (mistakes === 3) {
      setShowHintPopup(true)

      const timer = setTimeout(() => {
        setShowHintPopup(false)
      }, 800)

      return () => clearTimeout(timer)
    }
  }, [mistakes])

  useEffect(() => {
    setShowHintPopup(false)
  }, [wordObj])

  // ROUND LOGIC
  useEffect(() => {
  if (gameOver) return

  if (isWinner) {
    if (round === maxRounds) {
      setScore(10)
      setGameOver(true)
    } else {
      setTimeout(() => {
        resetGame(true)
      }, 500)
    }
  }

  if (isLoser) {
    setShowRestartPopup(true)

    setTimeout(() => {
      setShowRestartPopup(false)
      resetGame()
    }, 1500)
  }
}, [isWinner, isLoser, round, gameOver])



  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-white">

      <header className="w-full flex items-center justify-center mb-10">
  <h1 className="text-3xl font-bold tracking-[0.35em] ml-[1100px] mt-[20px]">HANGMAN</h1>
</header>

<img
  src="/acm.png"
  alt="ACM Logo"
  className="absolute top-6 left-14 h-24"
/>





      <div className="flex-1 flex items-center justify-center">

        <div className="flex w-full max-w-5xl justify-center gap-24 items-start">

          {/* LEFT */}
          <div className="flex flex-col items-center gap-12 w-1/2">

            <HangmanDrawing mistakes={mistakes} />

            <div className="w-[260px] h-[60px] flex items-center justify-center text-center">
              {mistakes >= 3 && (
                <div className="bg-indigo-900/60 border border-indigo-400 text-white px-4 py-2 rounded-lg w-full break-words">
                  Hint: {wordObj.hint}
                </div>
              )}
            </div>

          </div>

          {/* RIGHT */}
          <div className="flex flex-col items-center gap-12 w-1/2 mt-2">

          <p className="text-xl">
              Round: {round} / {maxRounds}
            </p>

            <div className="h-16 flex items-center justify-center">
              <HangmanWord
                word={wordToGuess}
                guessedLetters={guessedLetters}
                reveal={isLoser}
              />
            </div>

            <Keyboard
              disabled={isWinner || isLoser || gameFinished}
              activeLetters={guessedLetters.filter(letter =>
                wordToGuess.includes(letter)
              )}
              inactiveLetters={incorrectLetters}
              addGuessedLetter={addGuessedLetter}
            />

            <p className="text-sm">
              Wrong guesses left: {maxMistakes - mistakes}
            </p>

            

          </div>
        </div>

      </div>

      {/* HINT POPUP */}
      {showHintPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-indigo-900/60 border border-indigo-500 text-white px-6 py-4 rounded-xl shadow-lg text-center w-[320px]">
            <h2 className="text-lg font-bold mb-2">Hint Unlocked</h2>
            <p>{wordObj.hint}</p>
          </div>
        </div>
      )}

      {showRestartPopup && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
    <div className="bg-red-900/80 border border-red-400 px-8 py-6 rounded-xl text-center shadow-xl">
      <h2 className="text-xl font-bold text-red-200 mb-2">
        Wrong Word!
      </h2>
      <p className="text-slate-200">
        Game restarting from Round 1...
      </p>
    </div>
  </div>
)}

      {/* FINAL GAME WIN */}
      {gameOver && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
          <div className="bg-indigo-950/80 border border-indigo-500 px-10 py-8 rounded-2xl shadow-xl text-center w-[380px]">

            <h2 className="text-3xl font-bold text-blue-300 mb-4">
              Mission Complete 🚀
            </h2>

            <p className="text-lg mb-5 text-slate-200">
              Score: <span className="text-white font-bold ">{score}</span>
            </p>
            <button
  onClick={newMatch}
  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 transition rounded-lg text-white font-semibold"
>
Start New Match
</button>

            

          </div>
        </div>
      )}

    </div>
  )
}

export default App