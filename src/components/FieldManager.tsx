// src/components/FieldManager.tsx
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Polygon } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import { getFields, deleteField, Field } from "@/services/fieldsApi"


export default function FieldManager() {
    const [fields, setFields] = useState<Field[]>([])

    useEffect(() => {
        getFields().then(setFields)
    }, [])


    const handleDelete = async (id: string) => {
        await deleteField(id)
        setFields((prev) => prev.filter(f => f.id !== id))
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
                    {fields.map((f) => (
                        <div
                            key={f.id}
                            style={{
                                border: "1px solid #ddd",
                                borderRadius: "8px",
                                padding: "1rem",
                                background: "#fafafa",
                                textAlign: "left"
                            }}
                        >
                            <h3 style={{ marginBottom: "0.5rem" }}>{f.name}</h3>
                            <p style={{ margin: 0, fontSize: "14px" }}>Культура: {f.culture}</p>
                            <p style={{ margin: 0, fontSize: "14px" }}>Точек: {f.coordinates.length}</p>

                            <div style={{ height: "100px", marginTop: "1rem", borderRadius: "6px", overflow: "hidden" }}>
                                <MapContainer
                                    center={[f.coordinates[0].latitude, f.coordinates[0].longitude]}
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
                                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                    <Polygon
                                        positions={f.coordinates.map(c => [c.latitude, c.longitude] as [number, number])}
                                        pathOptions={{ color: "#2a82da" }}
                                    />
                                </MapContainer>
                            </div>

                            <div style={{ marginTop: "0.75rem", display: "flex", gap: "0.5rem" }}>
                                <Link to={`/fields/${f.id}`}>
                                    <button style={{ fontSize: "14px" }}>Посмотреть</button>
                                </Link>
                                <button
                                    style={{ fontSize: "14px", background: "#ffdede", color: "#a00" }}
                                    onClick={() => handleDelete(f.id)}
                                >
                                    Удалить
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
