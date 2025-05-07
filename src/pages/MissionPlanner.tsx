// src/pages/MissionPlanner.tsx
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { MapContainer, TileLayer, Polygon, Polyline, Marker } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { calculateMissionPlan } from "@/services/plannerApi"
import { getField } from "@/services/fieldsApi"
import { createMission } from "@/services/missionsApi"
import { useMap } from "react-leaflet"

export default function MissionPlanner() {
    const location = useLocation()
    const navigate = useNavigate()

    const { name, type, fieldId, droneId } = location.state as {
        name: string
        type: string
        fieldId: string
        droneId: string
    }

    const [fieldCoords, setFieldCoords] = useState<[number, number][]>([])
    const [routePoints, setRoutePoints] = useState<[number, number][]>([])
    const [startedAt, setStartedAt] = useState("")

    useEffect(() => {
        if (!fieldId) return
        getField(fieldId).then(field => {
            const coords = field.coordinates.map(c => [c.latitude, c.longitude] as [number, number])
            setFieldCoords(coords)
            return calculateMissionPlan(field.coordinates, type)
        }).then(planCoords => {
            const points = planCoords.map((c: { latitude: number; longitude: number }) => [c.latitude, c.longitude] as [number, number])
            setRoutePoints(points)
        })
    }, [fieldId, type])

    const handleSave = async () => {
        if (!fieldCoords.length || !routePoints.length) return

        const status = startedAt ? "MISSION_STATUS_SCHEDULED" : "MISSION_STATUS_CREATED"

        const payload = {
            name,
            type,
            status,
            fieldId,
            droneId,
            startedAt: (startedAt ? `${startedAt}:00Z` : new Date().toISOString()),
            plan: {
                coordinates: routePoints.map(([lat, lng]) => ({
                    latitude: lat,
                    longitude: lng,
                })),
            },
        }

        await createMission(payload)
        navigate("/missions")
    }


    return (
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
            <h2 style={{ fontSize: "1.8rem", marginBottom: "1rem" }}>Планирование маршрута миссии</h2>

            <div style={{
                marginBottom: "1rem",
                display: "flex",
                flexDirection: "column",
                gap: "1rem"
            }}>
                <input
                    type="datetime-local"
                    value={startedAt}
                    onChange={(e) => setStartedAt(e.target.value)}
                    style={{
                        padding: "10px",
                        fontSize: "16px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                        width: "100%",
                    }}
                />
            </div>

            <div style={{ border: "1px solid #ccc", borderRadius: "8px", overflow: "hidden", marginBottom: "1rem" }}>
                <MapContainer
                    center={fieldCoords[0] || [55.75, 37.61]}
                    zoom={16}
                    style={{ height: "500px" }}
                >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <FitMapToPolygon bounds={fieldCoords} />
                    {fieldCoords.length > 0 && <Polygon positions={fieldCoords} pathOptions={{ color: "blue" }} />}
                    {routePoints.length > 1 && (
                        <Polyline positions={routePoints} pathOptions={{ color: "green" }} />
                    )}
                    {routePoints.map((point, idx) => (
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
                    ))}
                </MapContainer>
            </div>

            <button onClick={handleSave} disabled={!routePoints.length}>
                Создать миссию
            </button>
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