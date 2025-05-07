// src/pages/DroneDetails.tsx
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getDrone, updateDrone } from "@/services/dronesApi"

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


export default function DroneDetails() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [name, setName] = useState("")
    const [status, setStatus] = useState("")
    const [editing, setEditing] = useState(false)

    useEffect(() => {
        if (!id) return
        getDrone(id).then((drone) => {
            setName(drone.name)
            setStatus(drone.status)
        })
    }, [id])

    const handleSave = async () => {
        if (!id) return
        await updateDrone(id, name, status)
        setEditing(false)
    }

    if (!id) return <p>Дрон не найден</p>

    return (
        <div style={{ maxWidth: "960px", margin: "0 auto", padding: "2rem" }}>
            <h2 style={{ fontSize: "1.8rem", marginBottom: "1rem" }}>
                Дрон: {editing ? "Редактирование" : name}
            </h2>

            {editing ? (
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
                        placeholder="Название дрона"
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
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        style={{
                            padding: "10px",
                            fontSize: "16px",
                            borderRadius: "6px",
                            border: "1px solid #ccc",
                            width: "100%",
                        }}
                    >
                        <option value="">Выберите статус</option>
                        <option value="DRONE_STATUS_AVAILABLE">Доступен</option>
                        <option value="DRONE_STATUS_IN_MISSION">На миссии</option>
                        <option value="DRONE_STATUS_CHARGING">Заряжается</option>
                        <option value="DRONE_STATUS_MAINTENANCE">Обслуживается</option>
                        <option value="DRONE_STATUS_OFFLINE">Отключен</option>
                    </select>
                </div>
            ) : (
                <div style={{ marginBottom: "1rem" }}>
                    <p><strong>Название:</strong> {name}</p>
                    <p
                        style={{
                            margin: 0,
                            fontSize: "14px",
                            color: STATUS_COLORS[status] || "#000",
                            fontWeight: 500,
                        }}
                    >
                        {STATUS_LABELS[status] || status}
                    </p>
                </div>
            )}

            <div style={{ display: "flex", gap: "1rem" }}>
                {!editing ? (
                    <button onClick={() => setEditing(true)}>Редактировать</button>
                ) : (
                    <>
                        <button onClick={handleSave}>Сохранить</button>
                        <button onClick={() => navigate("/drones")}>Отменить</button>
                    </>
                )}
            </div>
        </div>
    )
}
