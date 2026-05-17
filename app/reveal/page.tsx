"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import LoadingVibe from "@/components/ui/LoadingVibe"
import MoodReveal from "@/components/ui/MoodReveal"
import { useQuizStore } from "@/store/quiz-store"

export default function RevealPage() {
  const router = useRouter()
  const { mood, setDishes, setAppliedCoupon, setAddressId, addressId } = useQuizStore()
  const [isFetching, setIsFetching] = useState(false)

  useEffect(() => {
    if (!mood) router.push("/quiz")
  }, [mood, router])

  const handleShare = async () => {
    if (!mood) return
    const text = `I'm "${mood.moodLabel}" right now.\n${mood.moodDescription}\n\nFind out yours → rasam.vercel.app`

    if (navigator.share) {
      await navigator.share({ text })
    } else {
      await navigator.clipboard.writeText(text)
      alert("Copied to clipboard!")
    }
  }

  const handleContinue = async () => {
    if (!mood) return
    setIsFetching(true)

    try {
      const addrRes = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keywords: mood.dishKeywords,
          addressId: addressId ?? "__AUTO__",
          vegFilter: mood.vegFilter,
          moodLabel: mood.moodLabel,
        }),
      })
      const { dishes, addressId: resolvedId } = await addrRes.json()

      setDishes(dishes ?? [])
      if (resolvedId) setAddressId(resolvedId)

      const couponRes = await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ addressId: resolvedId ?? addressId }),
      })
      const { coupon } = await couponRes.json()
      if (coupon) setAppliedCoupon(coupon)

      router.push("/results")
    } catch (err) {
      console.error(err)
      router.push("/results")
    }
  }

  if (isFetching) return <LoadingVibe />
  if (!mood) return null

  return <MoodReveal mood={mood} onContinue={handleContinue} onShare={handleShare} />
}
