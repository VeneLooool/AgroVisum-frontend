import { Routes, Route } from "react-router-dom"
import Home from "@/pages/Home"
import Fields from "@/pages/Fields"
import Drones from "@/pages/Drones"
import styles from "@/styles/Layout.module.css"
import Navbar from "@/components/Navbar"
import FieldManager from "@/components/FieldManager"
import FieldEditor from "@/pages/FieldEditor"
import FieldDetails from "@/pages/FieldDetails"

function App() {
    return (
        <>
            <Navbar />
            <main className={`${styles.container} ${styles.main}`}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/fields" element={<FieldManager />} />
                    <Route path="/fields/new" element={<FieldEditor />} />
                    <Route path="/fields/:name" element={<FieldDetails />} />
                    <Route path="/drones" element={<Drones />} />
                </Routes>
            </main>
        </>
    )
}

export default App
