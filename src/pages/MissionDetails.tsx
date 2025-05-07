// src/pages/MissionDetails.tsx
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { MapContainer, TileLayer, Polygon } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import { getMission, updateMission } from "@/services/missionsApi"
import { getField } from "@/services/fieldsApi"
import { Marker, Polyline } from "react-leaflet"
import L from "leaflet"
import { getMissionPlanByMissionId } from "@/services/plannerApi"
import { useMap } from "react-leaflet"


export default function MissionDetails() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [mission, setMission] = useState<any>(null)
    const [fieldCoords, setFieldCoords] = useState<[number, number][]>([])
    const [editing, setEditing] = useState(false)
    const [startedAt, setStartedAt] = useState("")
    const [status, setStatus] = useState("")
    const [routePoints, setRoutePoints] = useState<[number, number][]>([])


    useEffect(() => {
        if (!id) return
        getMission(id).then((m) => {
            setMission(m)
            setStatus(m.status)
            setStartedAt(m.startedAt || "")
            if (m.fieldId) {
                getField(m.fieldId).then((f) => {
                    const coords = f.coordinates.map(c => [c.latitude, c.longitude] as [number, number])
                    setFieldCoords(coords)
                })
            }
            getMissionPlanByMissionId(m.id).then(planCoords => {
                const points = planCoords.map((c: any) => [c.latitude, c.longitude] as [number, number])
                setRoutePoints(points)
            })

        })

    }, [id])

    const handleSave = async () => {
        if (!id || !mission) return

        const payload = {
            name: mission.name,
            status,
            startedAt: startedAt ? `${startedAt}:00Z` : new Date().toISOString(),
            plan: {
                coordinates: routePoints.map(([lat, lng]) => ({
                    latitude: lat,
                    longitude: lng,
                })),
            },
        }

        await updateMission(id, payload)
        setEditing(false)
    }


    if (!mission) return <p>Загрузка...</p>

    const canEdit = status === "MISSION_STATUS_CREATED" || status === "MISSION_STATUS_SCHEDULED"

    return (
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
            <h2 style={{ fontSize: "1.8rem", marginBottom: "1rem" }}>
                Миссия: {mission.name}
            </h2>

            <div style={{ marginBottom: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <p><strong>Тип:</strong> {mission.type.replace("MISSION_TYPE_", "")}</p>
                <p><strong>Статус:</strong> {mission.status.replace("MISSION_STATUS_", "")}</p>
                <p><strong>Автор:</strong> {mission.createdBy}</p>
                <p><strong>Создана:</strong> {new Date(mission.createdAt).toLocaleString()}</p>
                <p><strong>Обновлена:</strong> {new Date(mission.updatedAt).toLocaleString()}</p>
                <p><strong>Запланирован старт:</strong> {mission.startedAt ? new Date(mission.startedAt).toLocaleString() : "—"}</p>
            </div>

            {canEdit && (
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
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        style={{
                            padding: "10px",
                            fontSize: "16px",
                            borderRadius: "6px",
                            border: "1px solid #ccc",
                        }}
                    >
                        <option value="MISSION_STATUS_CREATED">Создана</option>
                        <option value="MISSION_STATUS_SCHEDULED">Запланирована</option>
                        <option value="MISSION_STATUS_PENDING">В ожидании</option>
                        <option value="MISSION_STATUS_RUNNING">В процессе</option>
                        <option value="MISSION_STATUS_ANALYSE">Анализ</option>
                        <option value="MISSION_STATUS_CANCELED">Отменена</option>
                        <option value="MISSION_STATUS_FAILED">Провалена</option>
                        <option value="MISSION_STATUS_SUCCESS">Завершена</option>
                    </select>

                    <input
                        type="datetime-local"
                        value={startedAt}
                        onChange={(e) => setStartedAt(e.target.value)}
                        style={{
                            padding: "10px",
                            fontSize: "16px",
                            borderRadius: "6px",
                            border: "1px solid #ccc",
                        }}
                    />
                </div>
            )}

            {canEdit && (
                <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
                    {!editing ? (
                        <button onClick={() => setEditing(true)}>Изменить</button>
                    ) : (
                        <>
                            <button onClick={handleSave}>Сохранить</button>
                            <button onClick={() => navigate("/missions")}>Отмена</button>
                        </>
                    )}
                </div>
            )}

            {/* Карта */}
            <div style={{ border: "1px solid #ccc", borderRadius: "8px", overflow: "hidden" }}>
                <MapContainer center={fieldCoords[0] || [55.75, 37.61]} zoom={16} style={{ height: "500px" }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                    <FitMapToPolygon bounds={fieldCoords} />

                    {/* 👉 Здесь отрисовываем поле */}
                    {fieldCoords.length > 0 && (
                        <Polygon positions={fieldCoords} pathOptions={{ color: "blue" }} />
                    )}

                    {/* 👉 Здесь вставляем маршрут! */}
                    {routePoints.length > 1 && (
                        <Polyline positions={routePoints} pathOptions={{ color: "green" }} />
                    )}

                    {/* 👉 Если режим редактирования активен — точки можно двигать */}
                    {editing &&
                        routePoints.map((point, idx) => (
                            <DraggablePoint
                                key={idx}
                                index={idx}
                                point={point}
                                onMove={(newPt) => {
                                    const updated = [...routePoints]
                                    updated[idx] = newPt
                                    setRoutePoints(updated)
                                }}
                            />
                        ))
                    }
                </MapContainer>
            </div>
        </div>
    )
}

function DraggablePoint({
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
                html: `<div style="background:#00aa00;border-radius:50%;width:12px;height:12px;"></div>`,
                iconSize: [12, 12],
                iconAnchor: [6, 6],
            })}
        />
    )
}

function FitMapToPolygon({ bounds }: { bounds: [number, number][] }) {
    const map = useMap()

    useEffect(() => {
        if (bounds.length > 0) {
            map.fitBounds(bounds, { padding: [30, 30] })
        }
    }, [bounds, map])

    return null
}