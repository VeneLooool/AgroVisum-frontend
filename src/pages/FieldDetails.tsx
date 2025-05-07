// src/pages/FieldDetails.tsx
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Polygon, Marker, useMapEvents } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { getField, updateField, Coordinate } from "@/services/fieldsApi"

export default function FieldDetails() {
    const { id } = useParams()
    const [name, setName] = useState("")
    const [culture, setCulture] = useState("")
    const [coords, setCoords] = useState<[number, number][]>([])
    const [original, setOriginal] = useState<[number, number][]>([])
    const [editing, setEditing] = useState(false)

    useEffect(() => {
        if (!id) return
        getField(id).then((field) => {
            setName(field.name)
            setCulture(field.culture)
            const mapped = field.coordinates.map(c => [c.latitude, c.longitude] as [number, number])
            setCoords(mapped)
            setOriginal(mapped)
        })
    }, [id])


    const save = async () => {
        if (!id) return
        const updatedCoordinates: Coordinate[] = coords.map(([lat, lng]) => ({
            latitude: lat,
            longitude: lng
        }))
        await updateField(id, name, culture, updatedCoordinates)
        setOriginal(coords)
        setEditing(false)
    }


    const cancel = () => {
        setCoords(original)
        setEditing(false)
    }

    if (!name || coords.length === 0) return <p>Поле не найдено или ещё загружается...</p>

    return (
        <div style={{ maxWidth: "960px", margin: "0 auto", padding: "2rem" }}>
            {editing ? (
                <div style={{ marginBottom: "1rem" }}>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Название поля"
                        style={{
                            padding: "8px",
                            fontSize: "16px",
                            borderRadius: "6px",
                            border: "1px solid #ccc",
                            marginBottom: "0.5rem",
                            width: "100%",
                        }}
                    />
                    <select
                        value={culture}
                        onChange={(e) => setCulture(e.target.value)}
                        style={{
                            padding: "8px",
                            fontSize: "16px",
                            borderRadius: "6px",
                            border: "1px solid #ccc",
                            width: "100%",
                        }}
                    >
                        <option value="">Выберите культуру</option>
                        <option value="пшеница">Пшеница</option>
                        <option value="кукуруза">Кукуруза</option>
                        <option value="картофель">Картофель</option>
                        <option value="подсолнечник">Подсолнечник</option>
                    </select>
                </div>
            ) : (
                <>
                    <h2 style={{ fontSize: "1.8rem", marginBottom: "1rem" }}>
                        Поле: {name}
                    </h2>
                    <p style={{ marginBottom: "0.5rem" }}>Культура: {culture}</p>
                </>
            )}


            <div style={{ margin: "1rem 0", display: "flex", gap: "1rem" }}>
                {!editing ? (
                    <button onClick={() => setEditing(true)}>Редактировать</button>
                ) : (
                    <>
                        <button onClick={save}>Сохранить</button>
                        <button onClick={cancel}>Отменить</button>
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
