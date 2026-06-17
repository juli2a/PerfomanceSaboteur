import * as React from "react"

import { cn } from "@/lib/utils/cn"

interface SliderProps
  extends Omit<React.ComponentProps<"input">, "type" | "onChange" | "value"> {
  value: number
  onChange: (value: number) => void
}

function Slider({ value, min = 0, max = 100, onChange, className, ...props }: SliderProps) {
  const fillPercent = ((value - Number(min)) / (Number(max) - Number(min))) * 100

  return (
    <input
      type="range"
      value={value}
      min={min}
      max={max}
      onChange={(e) => onChange(Number(e.target.value))}
      className={cn("slider", className)}
      style={{ "--slider-fill": `${fillPercent}%` } as React.CSSProperties}
      {...props}
    />
  )
}

export { Slider }
