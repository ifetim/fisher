// src/components/CampusMap.tsx
// Free map using Leaflet + OpenStreetMap — no API key needed.
// Navy pins = where you spent. Yellow pins = cheaper alternatives.
//
// Install deps first:
//   npm install leaflet react-leaflet
//   npm install --save-dev @types/leaflet

'use client'

import { useEffect, useRef } from 'react'
import type { MatchedTransaction } from '@/lib/analyzeStatement'

interface CampusMapProps {
  transactions: MatchedTransaction[]
}

// ── Coordinates for every campus location in campusRestaurants.ts ─────────────
const LOCATION_COORDS: Record<string, [number, number]> = {
  // UCalgary
  'MacEwan Student Centre, UCalgary':     [51.07848, -114.13176],
  'Residence, UCalgary':                  [51.07710, -114.12850],
  'MacHall, UCalgary':                    [51.07848, -114.13176],
  'University of Calgary':                [51.07848, -114.13176],
  // SAIT
  'SAIT Campus, Calgary':                 [51.06420, -114.09390],
  'SAIT Aldred Centre, Calgary':          [51.06480, -114.09320],
  'SAIT Main Campus, Calgary':            [51.06420, -114.09390],
  'Senator Burns Building, SAIT':         [51.06450, -114.09350],
  // Off-campus Calgary
  'Delivery / Calgary':                   [51.07600, -114.13000],
  'Crowfoot / Calgary':                   [51.13200, -114.20300],
  // UofT
  'Myhal Centre, UofT':                   [43.65960, -79.39750],
  'Robarts Library, UofT':                [43.66470, -79.39970],
  'Hart House, UofT':                     [43.66400, -79.39630],
  'Sidney Smith Hall, UofT':              [43.66290, -79.39950],
  'University College, UofT':             [43.66320, -79.39580],
  'Innis College, UofT':                  [43.66240, -79.39910],
  'New College, UofT':                    [43.66280, -79.40040],
  'University of Toronto':                [43.66320, -79.39580],
  // McGill
  'Shatner University Centre, McGill':    [45.50550, -73.57690],
  'Royal Victoria College, McGill':       [45.50480, -73.57740],
  'Leacock Building, McGill':             [45.50430, -73.57630],
  'McGill University':                    [45.50550, -73.57690],
  // UWaterloo
  'Federation Hall, UWaterloo':           [43.47290, -80.54090],
  'Student Life Centre, UWaterloo':       [43.47240, -80.54200],
  'Davis Centre, UWaterloo':              [43.47230, -80.53980],
  'University of Waterloo':               [43.47290, -80.54090],
  // UBC
  'AMS Student Nest, UBC':               [49.26600, -123.24900],
  'Place Vanier Residence, UBC':          [49.26790, -123.25240],
  'University of British Columbia':       [49.26600, -123.24900],
  // McMaster
  'McMaster Student Centre':              [43.26090, -79.91940],
  'McMaster University Student Centre':   [43.26090, -79.91940],
  'Mary E. Keyes Residence, McMaster':    [43.25980, -79.91720],
  'Keyes Residence, McMaster':            [43.25980, -79.91720],
  'McMaster University':                  [43.26090, -79.91940],
  // Western
  'University Community Centre, Western': [43.01000, -81.27490],
  'Residence, Western University':        [43.00850, -81.27800],
  'Residence, Western':                   [43.00850, -81.27800],
  'Western University':                   [43.01000, -81.27490],
  // Queens
  "John Deutsch University Centre, Queens":  [44.22520, -76.49450],
  "John Deutsch University Centre, Queen's": [44.22520, -76.49450],
  "Leonard Hall Residence, Queen's":         [44.22600, -76.49380],
  "Residence, Queen's":                      [44.22600, -76.49380],
  "Queen's University":                      [44.22520, -76.49450],
}

function coordsFor(location: string): [number, number] | null {
  if (LOCATION_COORDS[location]) return LOCATION_COORDS[location]
  for (const [key, coords] of Object.entries(LOCATION_COORDS)) {
    if (location.includes(key) || key.includes(location)) return coords
  }
  return null
}

// ── SVG pin icons ─────────────────────────────────────────────────────────────
function svgIcon(fill: string, label: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40">
    <path d="M16 0C7.16 0 0 7.16 0 16c0 12 16 24 16 24S32 28 32 16C32 7.16 24.84 0 16 0z"
          fill="${fill}" stroke="white" stroke-width="2"/>
    <text x="16" y="20" font-family="sans-serif" font-size="10" font-weight="bold"
          fill="white" text-anchor="middle" dominant-baseline="middle">${label}</text>
  </svg>`
  return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg)
}

export default function CampusMap({ transactions }: CampusMapProps) {
  const mapRef       = useRef<HTMLDivElement>(null)
  const mapInstance  = useRef<import('leaflet').Map | null>(null)
  const layerGroup   = useRef<import('leaflet').LayerGroup | null>(null)

  useEffect(() => {
    if (!mapRef.current) return

    // Dynamically import Leaflet (avoids SSR window errors in Next.js)
    import('leaflet').then((L) => {
      // Fix default icon paths broken by webpack
      // @ts-expect-error – _getIconUrl is internal
      delete L.Icon.Default.prototype._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      // Init map once
      if (!mapInstance.current) {
        mapInstance.current = L.map(mapRef.current!, {
          center:    [51.07848, -114.13176], // default: UCalgary
          zoom:      15,
          zoomControl: true,
        })

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(mapInstance.current)

        layerGroup.current = L.layerGroup().addTo(mapInstance.current)
      }

      // Clear previous markers
      layerGroup.current!.clearLayers()

      const bounds: [number, number][] = []

      const navyIcon = L.icon({
        iconUrl:    svgIcon('#1B2A4A', '$'),
        iconSize:   [32, 40],
        iconAnchor: [16, 40],
        popupAnchor:[0, -42],
      })
      const yellowIcon = L.icon({
        iconUrl:    svgIcon('#C8920A', '✓'),
        iconSize:   [32, 40],
        iconAnchor: [16, 40],
        popupAnchor:[0, -42],
      })

      for (const tx of transactions) {
        // Main (expensive) location
        const mainCoords = coordsFor(tx.campus) ?? coordsFor(tx.location ?? '')
        if (mainCoords) {
          L.marker(mainCoords, { icon: navyIcon })
            .bindPopup(`
              <div style="font-family:sans-serif;min-width:150px">
                <strong>${tx.merchant}</strong><br/>
                <span style="color:#1B2A4A;font-weight:600">$${tx.amount.toFixed(2)}</span><br/>
                <small style="color:#64748b">${tx.campus}</small>
              </div>`)
            .addTo(layerGroup.current!)
          bounds.push(mainCoords)
        }

        // Cheaper alternatives
        for (const alt of tx.savings) {
          const altCoords = coordsFor(alt.location)
          if (altCoords) {
            L.marker(altCoords, { icon: yellowIcon })
              .bindPopup(`
                <div style="font-family:sans-serif;min-width:150px">
                  <strong>${alt.name}</strong><br/>
                  <span style="color:#C8920A;font-weight:600">~$${alt.avgMealCost}</span><br/>
                  <small style="color:#16a34a">Cheaper alternative</small><br/>
                  <small style="color:#64748b">${alt.location}</small>
                </div>`)
              .addTo(layerGroup.current!)
            bounds.push(altCoords)
          }
        }
      }

      // Fit map to show all pins
      if (bounds.length > 0) {
        mapInstance.current!.fitBounds(bounds, { padding: [40, 40] })
      }
    })

    return () => {
      // Cleanup on unmount
      if (mapInstance.current) {
        mapInstance.current.remove()
        mapInstance.current = null
      }
    }
  }, [transactions])

  return (
    <div style={{ borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}>
      {/* Leaflet CSS — load once */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        crossOrigin=""
      />
      <div ref={mapRef} style={{ width: '100%', height: 380 }} />
      <div style={{
        display: 'flex', gap: 20, padding: '10px 16px',
        background: 'white', borderTop: '1px solid #e2e8f0',
        fontSize: 12, color: '#475569',
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{
            background: '#1B2A4A', borderRadius: '50%',
            width: 10, height: 10, display: 'inline-block', flexShrink: 0,
          }} />
          Where you spent
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{
            background: '#C8920A', borderRadius: '50%',
            width: 10, height: 10, display: 'inline-block', flexShrink: 0,
          }} />
          Cheaper alternatives
        </span>
      </div>
    </div>
  )
}