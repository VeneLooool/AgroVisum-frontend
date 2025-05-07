// src/components/MissionsManager.tsx
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getMissions, Mission } from "@/services/missionsApi"

const STATUS_COLORS: Record<string, string> = {
    MISSION_STATUS_CREATED: "#999",
    MISSION_STATUS_SCHEDULED: "#0077ff",
    MISSION_STATUS_PENDING: "#ffaa00",
    MISSION_STATUS_RUNNING: "#00aa00",
    MISSION_STATUS_ANALYSE: "#6633cc",
    MISSION_STATUS_CANCELED: "#aaaaaa",
    MISSION_STATUS_WARNING: "#ffcc00",
    MISSION_STATUS_FAILED: "#ff4444",
    MISSION_STATUS_SUCCESS: "#00cc88",
}

export default function MissionsManager() {
    const [missions, setMissions] = useState<Mission[]>([])
    const navigate = useNavigate()

    useEffect(() => {
        getMissions().then(setMissions)
    }, [])

    const handleRowClick = (id: string) => {
        navigate(`/missions/${id}`)
    }

    return (
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <h2 style={{ fontSize: "1.8rem" }}>Мои миссии</h2>
                <button onClick={() => navigate("/missions/new")}>➕ Создать миссию</button>
            </div>

            {missions.length === 0 ? (
                <p style={{ color: "#666" }}>Нет созданных миссий</p>
            ) : (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                    <tr style={{ background: "#f5f5f5" }}>
                        <th style={thStyle}>ID</th>
                        <th style={thStyle}>Название</th>
                        <th style={thStyle}>Тип</th>
                        <th style={thStyle}>Статус</th>
                        <th style={thStyle}>Автор</th>
                        <th style={thStyle}>Создана</th>
                        <th style={thStyle}>Обновлена</th>
                        <th style={thStyle}>Старт</th>
                    </tr>
                    </thead>
                    <tbody>
                    {missions.map((m) => (
                        <tr
                            key={m.id}
                            onClick={() => handleRowClick(m.id)}
                            style={{ cursor: "pointer", borderBottom: "1px solid #eee" }}
                        >
                            <td style={tdStyle}>{m.id}</td>
                            <td style={tdStyle}>{m.name}</td>
                            <td style={tdStyle}>{m.type.replace("MISSION_TYPE_", "")}</td>
                            <td style={{ ...tdStyle, color: STATUS_COLORS[m.status] || "#000" }}>
                                {m.status.replace("MISSION_STATUS_", "")}
                            </td>
                            <td style={tdStyle}>{m.createdBy}</td>
                            <td style={tdStyle}>{new Date(m.createdAt).toLocaleString()}</td>
                            <td style={tdStyle}>{new Date(m.updatedAt).toLocaleString()}</td>
                            <td style={tdStyle}>
                                {m.startedAt ? new Date(m.startedAt).toLocaleString() : "—"}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}

const thStyle = {
    padding: "8px",
    borderBottom: "1px solid #ddd",
    textAlign: "left" as const,
    fontWeight: "bold" as const,
}

const tdStyle = {
    padding: "8px",
    borderBottom: "1px solid #eee",
    fontSize: "14px",
}
