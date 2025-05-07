// src/services/plannerApi.ts
const BASE_URL = "http://localhost:8082/v1/planner"

export type Coordinate = { latitude: number; longitude: number }

export async function calculateMissionPlan(missionBorders: Coordinate[], type: string) {
    const res = await fetch(`${BASE_URL}/mission`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            missionBorders,
            type,
        }),
    })
    if (!res.ok) {
        throw new Error("Ошибка при расчете маршрута миссии")
    }
    const data = await res.json()
    return data.plan.coordinates
}

export async function getMissionPlanByMissionId(missionId: string) {
    const res = await fetch(`${BASE_URL}/missions/${missionId}`)
    if (!res.ok) {
        throw new Error("Ошибка при получении плана миссии")
    }
    const data = await res.json()
    return data.plan.coordinates
}
