"use client"

interface Props {
  total: number
  current: number
}

export default function ProgressDots({ total, current }: Props) {
  return (
    <div className="flex justify-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`rounded-full transition-all duration-300 ${
            i === current
              ? "h-2 w-6 bg-orange-500"
              : i < current
                ? "h-2 w-2 bg-orange-300"
                : "h-2 w-2 bg-gray-200"
          }`}
        />
      ))}
    </div>
  )
}
