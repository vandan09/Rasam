export const QUESTIONS = [
  {
    id: "q1",
    text: "Your brain right now sounds like…",
    subtitle: "No overthinking. First instinct wins.",
    options: [
      "Soft rain on a window",
      "Absolute silence (suspicious)",
      "A lo-fi playlist called 'focus'",
      "A Mumbai local at 6 PM",
    ],
  },
  {
    id: "q2",
    text: "Be honest — today was:",
    subtitle: "We won't tell anyone. Probably.",
    options: [
      "A dumpster fire with sprinkles",
      "Fine. We don't talk about it.",
      "Weirdly okay? Who allowed this.",
      "Main character arc unlocked",
    ],
  },
  {
    id: "q3",
    text: "You just got 20 minutes of freedom. You:",
    subtitle: "The most honest answer, please.",
    options: [
      "Become one with the bed",
      "Scroll until your thumb files a complaint",
      "Call one person, then regret it",
      "Pretend you'll be productive",
    ],
  },
  {
    id: "q4",
    text: "This meal needs to be:",
    subtitle: "Still nothing about food. Promise.",
    options: [
      "A warm hug in a bowl",
      "Comfort with a side of guilt",
      "Fuel so I can keep going",
      "In and out. No feelings.",
    ],
  },
] as const

export type Question = (typeof QUESTIONS)[number]
