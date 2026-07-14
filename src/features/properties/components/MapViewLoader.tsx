"use client"

import dynamic from "next/dynamic"
import type { MapViewProps } from "./MapView"

const MapView = dynamic(
  () => import("./MapView").then((m) => ({ default: m.MapView })),
  {
    ssr: false,
    loading: () => (
      <div className="h-[600px] w-full animate-pulse rounded-xl bg-muted" />
    ),
  }
)

export function MapViewLoader({ properties }: MapViewProps) {
  return <MapView properties={properties} />
}
