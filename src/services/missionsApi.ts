// src/services/missionsApi.ts
const BASE_URL = "http://localhost:8082/v1/missions"
const USER_LOGIN = "tgromov"

export type Mission = {
    id: string
    name: string
    type: string
    status: string
    createdBy: string
    updatedBy: string
    createdAt: string
    updatedAt: string
    startedAt: string
    fieldId: string
    droneId: string
}

// Получить все миссии пользователя
export async function getMissions(): Promise<Mission[]> {
    const res = await fetch(`${BASE_URL}/authors/${USER_LOGIN}`)
    if (!res.ok) {
        throw new Error("Ошибка при получении списка миссий")
    }
    const data = await res.json()
    return data.missions
}

// Получить миссию по id
export async function getMission(id: string): Promise<Mission> {
    const res = await fetch(`${BASE_URL}/${id}`)
    if (!res.ok) {
        throw new Error("Ошибка при получении миссии")
    }
    const data = await res.json()
    return data.mission
}

// Создать миссию
export async function createMission(payload: {
    name: string
    type: string
    status: string
    fieldId: string
    droneId: string
    startedAt?: string
    plan: { coordinates: { latitude: number; longitude: number }[] }
}): Promise<Mission> {
    const res = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: payload.name,
            type: payload.type,
            status: payload.status,
            startedAt: payload.startedAt,
            createdBy: USER_LOGIN,
            fieldId: payload.fieldId,
            droneId: payload.droneId,
            plan: payload.plan, // ⬅️ добавляем план
        }),
    })
    if (!res.ok) {
        throw new Error("Ошибка при создании миссии")
    }
    const data = await res.json()
    return data.mission
}

// Обновить миссию
export async function updateMission(id: string, payload: {
    name: string
    status: string
    startedAt: string
    plan: { coordinates: { latitude: number; longitude: number }[] }
}): Promise<Mission> {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: payload.name,
            status: payload.status,
            startedAt: payload.startedAt,
            updatedBy: USER_LOGIN,
            plan: payload.plan, // ⬅️ обязательно отправляем план
        }),
    })
    if (!res.ok) {
        throw new Error("Ошибка при обновлении миссии")
    }
    const data = await res.json()
    return data.mission
}


// Удалить миссию
export async function deleteMission(id: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
    })
    if (!res.ok) {
        throw new Error("Ошибка при удалении миссии")
    }
}
