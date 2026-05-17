"use client"

interface Props {
  question: string
  options: string[]
  onSelect: (answer: string) => void
  selectedAnswer?: string
}

export default function QuestionCard({ question, options, onSelect, selectedAnswer }: Props) {
  return (
    <div className="mx-auto flex w-full max-w-md animate-fadeIn flex-col gap-6 px-4">
      <h2 className="text-center text-2xl font-semibold leading-snug text-gray-900">
        {question}
      </h2>
      <div className="flex flex-col gap-3">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onSelect(option)}
            className={`w-full rounded-2xl border-2 px-6 py-4 text-left text-base font-medium transition-all duration-200 active:scale-95 ${
              selectedAnswer === option
                ? "border-orange-500 bg-orange-50 text-orange-900"
                : "border-gray-200 bg-white text-gray-800 hover:border-orange-300 hover:bg-orange-50/50"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}
