import { useState, useEffect } from "react"
import styles from "./FieldManager.module.css"
import { Link } from "react-router-dom"

function normalizeCoordinates(
    coords: [number, number][],
    width = 300,
    height = 100
): string {
    if (coords.length === 0) return ""

    const xs = coords.map(([x]) => x)
    const ys = coords.map(([, y]) => y)
    const minX = Math.min(...xs)
    const maxX = Math.max(...xs)
    const minY = Math.min(...ys)
    const maxY = Math.max(...ys)

    const scaleX = width / (maxX - minX || 1)
    const scaleY = height / (maxY - minY || 1)

    return coords
        .map(([x, y]) => {
            const normX = (x - minX) * scaleX
            const normY = (y - minY) * scaleY
            return `${normX},${normY}`
        })
        .join(" ")
}


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
    const [creating, setCreating] = useState(false)
    const [name, setName] = useState("")
    const [crop, setCrop] = useState("")
    const [coords, setCoords] = useState<[number, number][]>([])
    const [editingIndex, setEditingIndex] = useState<number | null>(null)

    useEffect(() => {
        const saved = localStorage.getItem("fields")
        if (saved) {
            setFields(JSON.parse(saved))
        }
    }, [])

    useEffect(() => {
        localStorage.setItem("fields", JSON.stringify(fields))
    }, [fields])

    const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        setCoords([...coords, [x, y]])
    }

    const handleSubmit = () => {
        if (!name || !crop || coords.length < 3) return
        const entry: Field = {
            name,
            crop,
            coordinates: coords,
            metrics: { moisture: "—", temperature: "—" }
        }

        const updated = [...fields]
        if (editingIndex !== null) {
            updated[editingIndex] = entry
        } else {
            updated.push(entry)
        }

        setFields(updated)
        setName("")
        setCrop("")
        setCoords([])
        setCreating(false)
        setEditingIndex(null)
    }

    const handleEdit = (index: number) => {
        const f = fields[index]
        setName(f.name)
        setCrop(f.crop)
        setCoords(f.coordinates)
        setCreating(true)
        setEditingIndex(index)
    }

    const handleDelete = (index: number) => {
        const updated = [...fields]
        updated.splice(index, 1)
        setFields(updated)
    }


    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <h1 className={styles.title}>Мои поля</h1>
                <button onClick={() => setCreating(!creating)}>
                    {creating ? "Отмена" : "Добавить поле"}
                </button>
            </div>

            {creating && (
                <div className={styles.form}>
                    <input
                        className={styles.input}
                        placeholder="Название поля"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <select
                        className={styles.select}
                        value={crop}
                        onChange={(e) => setCrop(e.target.value)}
                    >
                        <option value="">Выберите культуру</option>
                        <option value="пшеница">Пшеница</option>
                        <option value="кукуруза">Кукуруза</option>
                        <option value="картофель">Картофель</option>
                        <option value="подсолнечник">Подсолнечник</option>
                    </select>

                    <div className={styles.map} onClick={handleMapClick}>
                        {coords.map(([x, y], i) => (
                            <div
                                key={i}
                                className={styles.point}
                                style={{ left: `${x}px`, top: `${y}px` }}
                            />
                        ))}
                    </div>

                    <div className={styles.buttonGroup}>
                        <button onClick={handleSubmit} disabled={!name || !crop || coords.length < 3}>
                            Сохранить
                        </button>
                        <button onClick={() => {
                            setCreating(false)
                            setName("")
                            setCrop("")
                            setCoords([])
                        }}>
                            Отмена
                        </button>
                    </div>
                </div>
            )}

            {fields.length === 0 && <p>Нет сохранённых полей</p>}

            <div className={styles.grid}>
                {fields.map((field, index) => (
                    <div className={styles.card} key={index}>
                        <div className={styles.cardTitle}>{field.name}</div>
                        <div className={styles.cardText}>Культура: {field.crop}</div>
                        <div className={styles.cardText}>Точек: {field.coordinates.length}</div>
                        <div className={styles.cardText}>
                            Влажность: {field.metrics.moisture}, Температура: {field.metrics.temperature}
                        </div>

                        <Link to={`/fields/${encodeURIComponent(field.name)}`}>
                            <svg
                                width="100%"
                                height="100"
                                viewBox="0 0 300 100"
                                style={{
                                    border: "1px solid #ddd",
                                    borderRadius: 4,
                                    background: "#f9f9f9",
                                    marginTop: 8,
                                    cursor: "pointer"
                                }}
                            >
                                <polygon
                                    fill="#cce5ff"
                                    stroke="#3399ff"
                                    strokeWidth="2"
                                    points={normalizeCoordinates(field.coordinates)}
                                />
                            </svg>
                        </Link>



                        <div className={styles.actions}>
                            <button onClick={() => alert("История пока не реализована")}>История</button>
                            <button onClick={() => handleEdit(index)}>Редактировать</button>
                            <button onClick={() => handleDelete(index)}>Удалить</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
