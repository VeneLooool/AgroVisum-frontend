import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Polygon } from "react-leaflet"
import "leaflet/dist/leaflet.css"

type LatLngTuple = [number, number]

/*type Field = {
    name: string
    crop: string
    coordinates: [number, number][]
    metrics: {
        moisture: string
        temperature: string
    }
}*/

type Field = {
    name: string
    crop: string
    coordinates: LatLngTuple[]
    metrics: {
        moisture: string
        temperature: string
    }
}

export default function FieldDetails() {
    const { name } = useParams()
    const [field, setField] = useState<Field | null>(null)

    useEffect(() => {
        const saved = localStorage.getItem("fields")
        if (saved) {
            const fields: Field[] = JSON.parse(saved)
            const match = fields.find(f => f.name === name)
            if (match) {
                setField(match)
            }
        }
    }, [name])

    if (!field || field.coordinates.length === 0) {
        return <p>Поле не найдено или не содержит координат</p>
    }

    const center = field.coordinates[0]

    return (
        <div style={{ padding: "2rem" }}>
            <h2>Поле: {field.name}</h2>
            <p>Культура: {field.crop}</p>
            <p>Влажность: {field.metrics.moisture}, Температура: {field.metrics.temperature}</p>

            <MapContainer center={center} zoom={16} style={{ height: "500px", marginTop: 20 }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                />
                <Polygon positions={field.coordinates} pathOptions={{ color: "blue" }} />
            </MapContainer>
        </div>
    )
}

/*
export default function FieldDetails() {
    const { name } = useParams()
    const [field, setField] = useState<Field | null>(null)
    const [coords, setCoords] = useState<[number, number][]>([])
    const [originalCoords, setOriginalCoords] = useState<[number, number][]>([])
    const [dragIndex, setDragIndex] = useState<number | null>(null)
    const [editing, setEditing] = useState(false)

    useEffect(() => {
        const stored = localStorage.getItem("fields")
        if (stored) {
            const fields: Field[] = JSON.parse(stored)
            const match = fields.find(f => f.name === name)
            if (match) {
                setField(match)
                setCoords(match.coordinates)
                setOriginalCoords(match.coordinates)
            }
        }
    }, [name])

    const handleMouseDown = (i: number) => {
        if (!editing) return
        setDragIndex(i)
    }

    const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
        if (!editing || dragIndex === null) return
        const rect = e.currentTarget.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        setCoords((prev) =>
            prev.map((point, i) => (i === dragIndex ? [x, y] : point))
        )
    }

    const handleMouseUp = () => setDragIndex(null)

    const handleSave = () => {
        if (!field) return
        const stored = localStorage.getItem("fields")
        if (stored) {
            const fields: Field[] = JSON.parse(stored)
            const index = fields.findIndex(f => f.name === field.name)
            if (index !== -1) {
                fields[index].coordinates = coords
                localStorage.setItem("fields", JSON.stringify(fields))
                setOriginalCoords(coords)
                setEditing(false)
            }
        }
    }

    const handleCancel = () => {
        setCoords(originalCoords)
        setEditing(false)
    }

    if (!field) return <p>Поле не найдено</p>

    return (
        <div style={{ padding: "2rem" }}>
            <h2 style={{ fontSize: "24px", marginBottom: "1rem" }}>
                Поле: {field.name}
            </h2>
            <p>Культура: {field.crop}</p>
            <p>Влажность: {field.metrics.moisture}, Температура: {field.metrics.temperature}</p>

            <div style={{ margin: "1rem 0", display: "flex", gap: "12px" }}>
                {!editing ? (
                    <button onClick={() => setEditing(true)}>Редактировать</button>
                ) : (
                    <>
                        <button onClick={handleSave}>💾 Сохранить</button>
                        <button onClick={handleCancel}>❌ Отменить</button>
                    </>
                )}
            </div>

            <svg
                width="100%"
                height="400"
                viewBox="0 0 800 400"
                style={{ border: "1px solid #ccc", marginTop: 24, background: "#f9f9f9" }}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
            >
                <polygon
                    points={coords.map(([x, y]) => `${x},${y}`).join(" ")}
                    fill="#e6f7ff"
                    stroke="#3399ff"
                    strokeWidth={2}
                />

                {coords.map(([x, y], i) => (
                    <circle
                        key={i}
                        cx={x}
                        cy={y}
                        r={6}
                        fill="blue"
                        stroke="#fff"
                        strokeWidth={2}
                        style={{ cursor: editing ? "pointer" : "default" }}
                        onMouseDown={() => handleMouseDown(i)}
                    />
                ))}
            </svg>
        </div>
    )
}
*/