// src/pages/FieldDetails.tsx
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Polygon, Marker, useMapEvents } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

type LatLngTuple = [number, number]

type Field = {
    name: string
    crop: string
    coordinates: LatLngTuple[]
    metrics: { moisture: string; temperature: string }
}

export default function FieldDetails() {
    const { name } = useParams()
    const [field, setField] = useState<Field | null>(null)
    const [editing, setEditing] = useState(false)
    const [coords, setCoords] = useState<LatLngTuple[]>([])
    const [original, setOriginal] = useState<LatLngTuple[]>([])

    useEffect(() => {
        const stored = localStorage.getItem("fields")
        if (stored) {
            const all: Field[] = JSON.parse(stored)
            const match = all.find(f => f.name === name)
            if (match) {
                setField(match)
                setCoords(match.coordinates)
                setOriginal(match.coordinates)
            }
        }
    }, [name])

    const save = () => {
        if (!field) return
        const stored = localStorage.getItem("fields")
        if (stored) {
            const all: Field[] = JSON.parse(stored)
            const index = all.findIndex(f => f.name === field.name)
            if (index !== -1) {
                all[index].coordinates = coords
                localStorage.setItem("fields", JSON.stringify(all))
                setEditing(false)
                setOriginal(coords)
            }
        }
    }

    const cancel = () => {
        setCoords(original)
        setEditing(false)
    }

    if (!field) return <p>Поле не найдено</p>

    return (
        <div style={{ maxWidth: "960px", margin: "0 auto", padding: "2rem" }}>
            <h2 style={{ fontSize: "1.8rem", marginBottom: "1rem" }}>
                Поле: {field.name}
            </h2>
            <p style={{ marginBottom: "0.5rem" }}>Культура: {field.crop}</p>
            <p style={{ marginBottom: "0.5rem" }}>
                Влажность: {field.metrics.moisture}, Температура: {field.metrics.temperature}
            </p>

            <div style={{ margin: "1rem 0", display: "flex", gap: "1rem" }}>
                {!editing ? (
                    <button onClick={() => setEditing(true)}>✏️ Редактировать</button>
                ) : (
                    <>
                        <button onClick={save}>💾 Сохранить</button>
                        <button onClick={cancel}>❌ Отменить</button>
                    </>
                )}
            </div>

            <div style={{ border: "1px solid #ccc", borderRadius: "8px", overflow: "hidden" }}>
                <MapContainer center={coords[0]} zoom={16} style={{ height: "500px" }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Polygon positions={coords} pathOptions={{ color: "blue" }} />
                    {editing &&
                        coords.map((point, idx) => (
                            <DraggableMarker
                                key={idx}
                                index={idx}
                                point={point}
                                onMove={(newPt) => {
                                    const updated = [...coords]
                                    updated[idx] = newPt
                                    setCoords(updated)
                                }}
                            />
                        ))}
                </MapContainer>
            </div>
        </div>
    )
}

function DraggableMarker({
                             point,
                             index,
                             onMove,
                         }: {
    point: [number, number]
    index: number
    onMove: (newPoint: [number, number]) => void
}) {
    const [position, setPosition] = useState<[number, number]>(point)

    useEffect(() => {
        setPosition(point)
    }, [point])

    const eventHandlers = {
        dragend(e: L.LeafletEvent) {
            const marker = e.target
            const latlng = marker.getLatLng()
            onMove([latlng.lat, latlng.lng])
        },
    }

    return (
        <Marker
            draggable
            position={position}
            eventHandlers={eventHandlers}
            icon={L.divIcon({
                className: "custom-marker",
                html: `<div style="background:#0077ff;border-radius:50%;width:12px;height:12px;"></div>`,
                iconSize: [12, 12],
                iconAnchor: [6, 6],
            })}
        />
    )
}
