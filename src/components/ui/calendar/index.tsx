"use client"

import * as React from "react"
import { DayPicker, DayPickerProps } from "react-day-picker"
import "react-day-picker/dist/style.css"

export function Calendar(props: DayPickerProps) {
  return (
    <DayPicker
      className="p-2 bg-white rounded-md shadow-md"
      {...props}
    />
  )
} 