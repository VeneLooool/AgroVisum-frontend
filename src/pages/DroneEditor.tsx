// src/pages/DroneEditor.tsx
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { createDrone } from "@/services/dronesApi"

export default function DroneEditor() {
    const [name, setName] = useState("")
    const navigate = useNavigate()

    const handleSave = async () => {
        if (!name) return
        try {
            await createDrone(name)
            navigate("/drones")
        } catch (error) {
            console.error("Ошибка при создании дрона", error)
            alert("Не удалось создать дрона")
        }
    }

    return (
        <div style={{ maxWidth: "960px", margin: "0 auto", padding: "2rem" }}>
            <h2 style={{ fontSize: "1.8rem", marginBottom: "1rem" }}>Добавление нового дрона</h2>
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
            </div>
            <button onClick={handleSave} disabled={!name}>
                Сохранить
            </button>
        </div>
    )
}
