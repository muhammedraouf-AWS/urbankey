"use client"

import { useEffect, useRef, useState } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import Link from "next/link"
import Image from "next/image"
import { X, BedDouble, Bath, Maximize2 } from "lucide-react"
import type { Property } from "@/types/property"
import { formatPrice } from "@/lib/utils"

// ─── Helpers ─────────────────────────────────────────────────────────────────

function abbrevPrice(price: number, currency: string): string {
  const symbol = currency === "USD" ? "$" : currency
  if (price >= 1_000_000) return `${symbol}${(price / 1_000_000).toFixed(1)}M`
  if (price >= 1_000) return `${symbol}${Math.round(price / 1_000)}K`
  return `${symbol}${price}`
}

function calcCenter(properties: Property[]): [number, number] {
  const valid = properties.filter(
    (p) => p.location.coordinates.lat !== 0 || p.location.coordinates.lng !== 0
  )
  if (valid.length === 0) return [-80.1918, 25.7617]
  const avgLng = valid.reduce((s, p) => s + p.location.coordinates.lng, 0) / valid.length
  const avgLat = valid.reduce((s, p) => s + p.location.coordinates.lat, 0) / valid.length
  return [avgLng, avgLat]
}

type PointFeatureCollection = {
  type: "FeatureCollection"
  features: Array<{
    type: "Feature"
    geometry: { type: "Point"; coordinates: [number, number] }
    properties: { id: number; price_label: string }
  }>
}

function toGeoJSON(properties: Property[]): PointFeatureCollection {
  return {
    type: "FeatureCollection",
    features: properties
      .filter(
        (p) => p.location.coordinates.lat !== 0 || p.location.coordinates.lng !== 0
      )
      .map((p) => ({
        type: "Feature" as const,
        geometry: {
          type: "Point" as const,
          coordinates: [p.location.coordinates.lng, p.location.coordinates.lat] as [number, number],
        },
        properties: {
          id: p.id,
          price_label: abbrevPrice(p.price, p.currency),
        },
      })),
  }
}

// ─── PropertyMapCard ──────────────────────────────────────────────────────────

function PropertyMapCard({
  property,
  onClose,
}: {
  property: Property
  onClose: () => void
}) {
  const image = property.images[0]

  return (
    <div className="absolute bottom-4 left-4 z-10 w-72 overflow-hidden rounded-xl bg-card shadow-2xl ring-1 ring-border">
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-2 top-2 z-20 rounded-full bg-background/80 p-1 backdrop-blur-sm hover:bg-background"
      >
        <X className="size-4 text-foreground" />
      </button>

      {image ? (
        <div className="relative h-36 w-full">
          <Image
            src={image.url}
            alt={property.title}
            fill
            className="object-cover"
            sizes="288px"
          />
          <span className="absolute bottom-2 left-2 rounded-full bg-[var(--navy)] px-2 py-0.5 text-xs font-medium text-white">
            {property.listingType === "sale" ? "For Sale" : "For Rent"}
          </span>
        </div>
      ) : (
        <div className="h-36 w-full bg-muted" />
      )}

      <div className="p-3">
        <p className="font-serif text-lg font-semibold leading-tight text-[var(--gold)]">
          {formatPrice(property.price, property.currency)}
        </p>
        <p className="mt-0.5 line-clamp-1 text-sm font-medium text-foreground">
          {property.title}
        </p>
        <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
          {property.location.address}
        </p>

        <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
          {property.bedrooms > 0 && (
            <span className="flex items-center gap-1">
              <BedDouble className="size-3" />
              {property.bedrooms}
            </span>
          )}
          {property.bathrooms > 0 && (
            <span className="flex items-center gap-1">
              <Bath className="size-3" />
              {property.bathrooms}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Maximize2 className="size-3" />
            {property.area.toLocaleString()} {property.areaUnit}
          </span>
        </div>

        <Link
          href={`/properties/${property.slug}`}
          className="mt-3 block w-full rounded-lg bg-[var(--navy)] py-2 text-center text-xs font-semibold text-white transition-opacity hover:opacity-90"
        >
          View Property
        </Link>
      </div>
    </div>
  )
}

// ─── MapView ──────────────────────────────────────────────────────────────────

export interface MapViewProps {
  properties: Property[]
}

export function MapView({ properties }: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  // Keep a stable ref to properties for click handlers (avoids stale closure)
  const propertiesRef = useRef(properties)
  propertiesRef.current = properties

  const [selected, setSelected] = useState<Property | null>(null)

  // Init map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
    if (!token) {
      console.warn("NEXT_PUBLIC_MAPBOX_TOKEN is not set. Map will not render.")
      return
    }

    mapboxgl.accessToken = token

    const m = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: calcCenter(properties),
      zoom: 11,
    })

    m.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right")
    m.addControl(new mapboxgl.FullscreenControl(), "top-right")

    m.on("load", () => {
      m.addSource("properties", {
        type: "geojson",
        data: toGeoJSON(propertiesRef.current),
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 60,
      })

      // Cluster background circles — size scales with count
      m.addLayer({
        id: "clusters",
        type: "circle",
        source: "properties",
        filter: ["has", "point_count"],
        paint: {
          "circle-color": "#1e3a5f",
          "circle-radius": [
            "step",
            ["get", "point_count"],
            22, // < 10
            10,
            28, // 10–29
            30,
            36, // ≥ 30
          ],
          "circle-stroke-width": 3,
          "circle-stroke-color": "#ffffff",
          "circle-opacity": 0.9,
        },
      })

      // Cluster count text
      m.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "properties",
        filter: ["has", "point_count"],
        layout: {
          "text-field": "{point_count_abbreviated}",
          "text-font": ["DIN Offc Pro Bold", "Arial Unicode MS Bold"],
          "text-size": 13,
        },
        paint: { "text-color": "#ffffff" },
      })

      // Individual property marker (background circle)
      m.addLayer({
        id: "unclustered-point",
        type: "circle",
        source: "properties",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": "#c9a84c",
          "circle-radius": 22,
          "circle-stroke-width": 2,
          "circle-stroke-color": "#ffffff",
          "circle-opacity": 0.95,
        },
      })

      // Price label on individual markers
      m.addLayer({
        id: "unclustered-label",
        type: "symbol",
        source: "properties",
        filter: ["!", ["has", "point_count"]],
        layout: {
          "text-field": ["get", "price_label"],
          "text-font": ["DIN Offc Pro Bold", "Arial Unicode MS Bold"],
          "text-size": 11,
          "text-allow-overlap": true,
          "text-ignore-placement": true,
        },
        paint: { "text-color": "#ffffff" },
      })

      // Click cluster → zoom to expand
      m.on("click", "clusters", (e) => {
        const features = m.queryRenderedFeatures(e.point, { layers: ["clusters"] })
        const feature = features[0]
        if (!feature) return
        const clusterId = feature.properties?.cluster_id as number
        const source = m.getSource("properties") as mapboxgl.GeoJSONSource
        const geom = feature.geometry as { type: "Point"; coordinates: [number, number] }
        source.getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err || zoom == null) return
          m.easeTo({ center: geom.coordinates, zoom })
        })
      })

      // Click individual marker → show preview card
      m.on("click", "unclustered-point", (e) => {
        const feature = e.features?.[0]
        if (!feature) return
        const id = feature.properties?.id as number
        const prop = propertiesRef.current.find((p) => p.id === id)
        if (prop) setSelected(prop)
      })

      // Pointer cursor on hover
      m.on("mouseenter", "clusters", () => {
        m.getCanvas().style.cursor = "pointer"
      })
      m.on("mouseleave", "clusters", () => {
        m.getCanvas().style.cursor = ""
      })
      m.on("mouseenter", "unclustered-point", () => {
        m.getCanvas().style.cursor = "pointer"
      })
      m.on("mouseleave", "unclustered-point", () => {
        m.getCanvas().style.cursor = ""
      })
    })

    mapRef.current = m

    return () => {
      m.remove()
      mapRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Update map source when properties change (e.g. filter applied while on map view)
  useEffect(() => {
    const m = mapRef.current
    if (!m?.isStyleLoaded()) return
    const source = m.getSource("properties") as mapboxgl.GeoJSONSource | undefined
    source?.setData(toGeoJSON(properties))
    setSelected(null)
  }, [properties])

  return (
    <div className="relative h-[600px] w-full overflow-hidden rounded-xl border border-border">
      <div ref={containerRef} className="h-full w-full" />
      {selected && (
        <PropertyMapCard property={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  )
}
