// src/components/FieldManager.tsx
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Polygon } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import { getFields, deleteField, Field } from "@/services/fieldsApi"


type Field = {
    name: string
    crop: string
    coordinates: [number, number][]
    metrics: {
        moisture: string
        temperature: string
    }
}

export default function FieldManager() {
    const [fields, setFields] = useState<Field[]>([])

    useEffect(() => {
        const stored = localStorage.getItem("fields")
        if (stored) {
            setFields(JSON.parse(stored))
        }
    }, [])

    const handleDelete = (nameToDelete: string) => {
        const updated = fields.filter(f => f.name !== nameToDelete)
        setFields(updated)
        localStorage.setItem("fields", JSON.stringify(updated))
    }

    return (
        <div style={{ maxWidth: "960px", margin: "0 auto", padding: "2rem" }}>
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem"
            }}>
                <h2 style={{ fontSize: "1.8rem" }}>Мои поля</h2>
                <Link to="/fields/new">
                    <button>➕ Добавить поле</button>
                </Link>
            </div>

            {fields.length === 0 ? (
                <p style={{ color: "#666" }}>Нет сохранённых полей</p>
            ) : (
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                    gap: "1.5rem"
                }}>
                    {fields.map((f, i) => (
                        <div
                            key={i}
                            style={{
                                border: "1px solid #ddd",
                                borderRadius: "8px",
                                padding: "1rem",
                                background: "#fafafa",
                                textAlign: "left"
                            }}
                        >
                            <h3 style={{ marginBottom: "0.5rem" }}>{f.name}</h3>
                            <p style={{ margin: 0, fontSize: "14px" }}>Культура: {f.crop}</p>
                            <p style={{ margin: 0, fontSize: "14px" }}>Точек: {f.coordinates.length}</p>
                            <p style={{ margin: 0, fontSize: "14px" }}>
                                Влажность: {f.metrics.moisture}, Температура: {f.metrics.temperature}
                            </p>
                            <div style={{ height: "100px", marginTop: "1rem", borderRadius: "6px", overflow: "hidden" }}>
                                <MapContainer
                                    center={f.coordinates[0]}
                                    zoom={16}
                                    style={{ height: "100%", width: "100%" }}
                                    dragging={false}
                                    zoomControl={false}
                                    scrollWheelZoom={false}
                                    doubleClickZoom={false}
                                    attributionControl={false}
                                    touchZoom={false}
                                    boxZoom={false}
                                    keyboard={false}
                                >
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    <Polygon positions={f.coordinates} pathOptions={{ color: "#2a82da" }} />
                                </MapContainer>
                            </div>

                            <div style={{ marginTop: "0.75rem", display: "flex", gap: "0.5rem" }}>
                                <Link to={`/fields/${encodeURIComponent(f.name)}`}>
                                    <button style={{ fontSize: "14px" }}>👁 Посмотреть</button>
                                </Link>
                                <button
                                    style={{ fontSize: "14px", background: "#ffdede", color: "#a00" }}
                                    onClick={() => handleDelete(f.name)}
                                >
                                    ❌ Удалить
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
