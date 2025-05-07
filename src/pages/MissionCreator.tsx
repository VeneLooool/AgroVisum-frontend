// src/pages/MissionCreator.tsx
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getFields, Field } from "@/services/fieldsApi"
import { getDrones, Drone } from "@/services/dronesApi"


export default function MissionCreator() {
    const navigate = useNavigate()

    const [name, setName] = useState("")
    const [type, setType] = useState("")
    const [fields, setFields] = useState<Field[]>([])
    const [selectedFieldId, setSelectedFieldId] = useState("")
    const [drones, setDrones] = useState<Drone[]>([])
    const [selectedDroneId, setSelectedDroneId] = useState("")


    useEffect(() => {
        getFields().then(setFields)
        getDrones().then(setDrones)
    }, [])

    const handleNext = () => {
        if (!name || !type || !selectedFieldId) return
        // Переход на страницу планирования миссии
        navigate("/missions/new/plan", {
            state: {
                name,
                type,
                fieldId: selectedFieldId,
                droneId: selectedDroneId,
            },
        })
    }

    return (
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem" }}>
            <h2 style={{ fontSize: "1.8rem", marginBottom: "1rem" }}>Создание новой миссии</h2>

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
                    placeholder="Название миссии"
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
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    style={{
                        padding: "10px",
                        fontSize: "16px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                        width: "100%",
                    }}
                >
                    <option value="">Выберите тип миссии</option>
                    <option value="MISSION_TYPE_PATROL">Патрулирование</option>
                    <option value="MISSION_TYPE_RESEARCH">Исследование</option>
                </select>

                <select
                    value={selectedFieldId}
                    onChange={(e) => setSelectedFieldId(e.target.value)}
                    style={{
                        padding: "10px",
                        fontSize: "16px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                        width: "100%",
                    }}
                >
                    <option value="">Выберите поле</option>
                    {fields.map((f) => (
                        <option key={f.id} value={f.id}>
                            {f.name}
                        </option>
                    ))}
                </select>

                <select
                    value={selectedDroneId}
                    onChange={(e) => setSelectedDroneId(e.target.value)}
                    style={{
                        padding: "10px",
                        fontSize: "16px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                        width: "100%",
                    }}
                >
                    <option value="">Выберите дрон</option>
                    {drones.map((d) => (
                        <option key={d.id} value={d.id}>
                            {d.name}
                        </option>
                    ))}
                </select>

            </div>

            <button
                onClick={handleNext}
                disabled={!name || !type || !selectedFieldId}
            >
                Перейти к планированию маршрута
            </button>
        </div>
    )
}
