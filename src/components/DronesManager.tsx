// src/components/DronesManager.tsx
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getDrones, deleteDrone, Drone } from "@/services/dronesApi"

const STATUS_LABELS: Record<string, string> = {
    DRONE_STATUS_AVAILABLE: "Доступен",
    DRONE_STATUS_IN_MISSION: "На миссии",
    DRONE_STATUS_CHARGING: "На зарядке",
    DRONE_STATUS_MAINTENANCE: "Обслуживается",
    DRONE_STATUS_OFFLINE: "Отключен",
}

const STATUS_COLORS: Record<string, string> = {
    DRONE_STATUS_AVAILABLE: "#2ecc71",     // зелёный
    DRONE_STATUS_IN_MISSION: "#3498db",    // синий
    DRONE_STATUS_CHARGING: "#f1c40f",      // жёлтый
    DRONE_STATUS_MAINTENANCE: "#e67e22",   // оранжевый
    DRONE_STATUS_OFFLINE: "#e74c3c",       // красный
}


export default function DronesManager() {
    const [drones, setDrones] = useState<Drone[]>([])

    useEffect(() => {
        getDrones().then(setDrones)
    }, [])

    const handleDelete = async (id: string) => {
        await deleteDrone(id)
        setDrones((prev) => prev.filter((d) => d.id !== id))
    }

    return (
        <div style={{ maxWidth: "960px", margin: "0 auto", padding: "2rem" }}>
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem"
            }}>
                <h2 style={{ fontSize: "1.8rem" }}>Мои дроны</h2>
                <Link to="/drones/new">
                    <button>➕ Добавить дрона</button>
                </Link>
            </div>

            {drones.length === 0 ? (
                <p style={{ color: "#666" }}>Нет сохранённых дронов</p>
            ) : (
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                    gap: "1.5rem"
                }}>
                    {drones.map((d) => (
                        <div
                            key={d.id}
                            style={{
                                border: "1px solid #ddd",
                                borderRadius: "8px",
                                padding: "1rem",
                                background: "#fafafa",
                                textAlign: "left"
                            }}
                        >
                            <h3 style={{ marginBottom: "0.5rem" }}>{d.name}</h3>
                            <p
                                style={{
                                    margin: 0,
                                    fontSize: "14px",
                                    color: STATUS_COLORS[d.status] || "#000",
                                    fontWeight: 500,
                                }}
                            >
                                {STATUS_LABELS[d.status] || d.status}
                            </p>
                            <div style={{ marginTop: "0.75rem", display: "flex", gap: "0.5rem" }}>
                                <Link to={`/drones/${d.id}`}>
                                    <button style={{ fontSize: "14px" }}>Посмотреть</button>
                                </Link>
                                <button
                                    style={{ fontSize: "14px", background: "#ffdede", color: "#a00" }}
                                    onClick={() => handleDelete(d.id)}
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
