const BASE_URL = "http://localhost:8081/v1/drones"
const USER_LOGIN = "tgromov"

export type Drone = {
    id: string
    name: string
    status: string
    createdBy: string
}

// Получить список всех дронов пользователя
export async function getDrones(): Promise<Drone[]> {
    const res = await fetch(`${BASE_URL}/authors/${USER_LOGIN}`)
    if (!res.ok) {
        throw new Error("Ошибка при получении списка дронов")
    }
    const data = await res.json()
    return data.drones
}

// Получить конкретного дрона по id
export async function getDrone(id: string): Promise<Drone> {
    const res = await fetch(`${BASE_URL}/${id}`)
    if (!res.ok) {
        throw new Error("Ошибка при получении дрона")
    }
    const data = await res.json()
    return data.drone
}

// Создать нового дрона
export async function createDrone(name: string): Promise<Drone> {
    const res = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name,
            createdBy: USER_LOGIN,
        }),
    })
    if (!res.ok) {
        throw new Error("Ошибка при создании дрона")
    }
    const data = await res.json()
    return data.drone
}

// Обновить дрона
export async function updateDrone(id: string, name: string, status: string): Promise<Drone> {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name,
            status,
        }),
    })
    if (!res.ok) {
        throw new Error("Ошибка при обновлении дрона")
    }
    const data = await res.json()
    return data.drone
}

// Удалить дрона
export async function deleteDrone(id: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
    })
    if (!res.ok) {
        throw new Error("Ошибка при удалении дрона")
    }
}
