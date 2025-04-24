import { Routes, Route } from "react-router-dom"
import Home from "@/pages/Home"
import Fields from "@/pages/Fields"
import Drones from "@/pages/Drones"
import FieldDetails from "@/pages/FieldDetails"
import styles from "@/styles/Layout.module.css"
import Navbar from "@/components/Navbar"

function App() {
    return (
        <>
            <Navbar />
            <main className={`${styles.container} ${styles.main}`}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/fields" element={<Fields />} />
                    <Route path="/drones" element={<Drones />} />
                    <Route path="/fields/:name" element={<FieldDetails />} />
                </Routes>
            </main>
        </>
    )
}

export default App
