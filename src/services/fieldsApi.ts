const BASE_URL = "http://localhost:8080/v1/fields"
const USER_LOGIN = "tgromov"

export type Coordinate = { latitude: number; longitude: number }

export type Field = {
    id: string
    name: string
    culture: string
    createdBy: string
    coordinates: Coordinate[]
}

// GET /v1/fields/authors/{login}
export async function getFields(): Promise<Field[]> {
    const res = await fetch(`${BASE_URL}/authors/${USER_LOGIN}`)
    const data = await res.json()
    return data.fields
}

// GET /v1/fields/{id}
export async function getField(id: string): Promise<Field> {
    const res = await fetch(`${BASE_URL}/${id}`)
    const data = await res.json()
    return data.field
}

// POST /v1/fields
export async function createField(name: string, culture: string, coordinates: Coordinate[]): Promise<Field> {
    const res = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name,
            culture,
            createdBy: USER_LOGIN,
            coordinates,
        }),
    })
    const data = await res.json()
    return data.field
}

// PUT /v1/fields/{id}
export async function updateField(id: string, name: string, culture: string, coordinates: Coordinate[]): Promise<Field> {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name,
            culture,
            coordinates,
        }),
    })
    const data = await res.json()
    return data.field
}

// DELETE /v1/fields/{id}
export async function deleteField(id: string): Promise<void> {
    await fetch(`${BASE_URL}/${id}`, { method: "DELETE" })
}
