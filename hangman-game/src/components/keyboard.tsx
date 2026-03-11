type Props = {
  disabled?: boolean
  activeLetters: string[]
  inactiveLetters: string[]
  addGuessedLetter: (letter: string) => void
}

const KEYS = "abcdefghijklmnopqrstuvwxyz".split("")

export default function Keyboard({
  disabled = false,
  activeLetters,
  inactiveLetters,
  addGuessedLetter
}: Props) {

  return (
    <div className="grid grid-cols-9 gap-8">

      {KEYS.map(key => {

        const isActive = activeLetters.includes(key)
        const isInactive = inactiveLetters.includes(key)

        return (
          <button
            key={key}
            onClick={() => addGuessedLetter(key)}
            disabled={isActive || isInactive || disabled}
            className={`
h-12 w-10
flex items-center justify-center
text-lg font-bold uppercase
rounded-xl
border
transition-all duration-150
hover:bg-slate-700

${isActive ? "bg-green-900/50 border-green-500 text-green-200"
: isInactive ? "bg-red-900/50 border-red-500 text-red-200"
: "bg-slate-800 border-slate-500 text-white"}

${disabled ? "opacity-50 cursor-not-allowed" : ""}
`}
          >
            {key}
          </button>
        )
      })}

    </div>
  )
}