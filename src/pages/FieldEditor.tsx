// src/pages/FieldEditor.tsx
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { MapContainer, TileLayer, Polygon, useMapEvents } from "react-leaflet"
import "leaflet/dist/leaflet.css"

export default function FieldEditor() {
    const [points, setPoints] = useState<[number, number][]>([])
    const [name, setName] = useState("")
    const [crop, setCrop] = useState("")
    const navigate = useNavigate()

    const handleSave = () => {
        if (!name || !crop || points.length < 3) return
        const newField = {
            name,
            crop,
            coordinates: points,
            metrics: { moisture: "—", temperature: "—" },
        }
        const stored = localStorage.getItem("fields")
        const fields = stored ? JSON.parse(stored) : []
        fields.push(newField)
        localStorage.setItem("fields", JSON.stringify(fields))
        navigate("/fields")
    }

    function MapClickHandler() {
        useMapEvents({
            click(e) {
                setPoints((prev) => [...prev, [e.latlng.lat, e.latlng.lng]])
            },
        })
        return null
    }

    return (
        <div style={{ maxWidth: "960px", margin: "0 auto", padding: "2rem" }}>
            <h2 style={{ fontSize: "1.8rem", marginBottom: "1rem" }}>Новое поле</h2>

            {/* 👇 Форма */}
            <div style={{
                background: "#fff",
                padding: "1rem",
                borderRadius: "8px",
                border: "1px solid #ddd",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                marginBottom: "1.5rem"
            }}>
                <input
                    type="text"
                    placeholder="Название поля"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                        padding: "10px",
                        fontSize: "16px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                        width: "100%",
                    }}
                />
                <select
                    value={crop}
                    onChange={(e) => setCrop(e.target.value)}
                    style={{
                        padding: "10px",
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

            {/* 👇 Карта */}
            <div style={{ border: "1px solid #ccc", borderRadius: "8px", overflow: "hidden" }}>
                <MapContainer center={[55.75, 37.61]} zoom={14} style={{ height: "400px" }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <MapClickHandler />
                    {points.length >= 3 && (
                        <Polygon positions={points} pathOptions={{ color: "green" }} />
                    )}
                </MapContainer>
            </div>

            {/* 👇 Кнопка */}
            <div style={{ marginTop: "1rem" }}>
                <button onClick={handleSave} disabled={!name || !crop || points.length < 3}>
                    ✅ Сохранить поле
                </button>
            </div>
        </div>
    )
}
