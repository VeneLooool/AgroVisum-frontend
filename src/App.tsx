import { Routes, Route } from "react-router-dom"
import Home from "@/pages/Home"
import styles from "@/styles/Layout.module.css"
import Navbar from "@/components/Navbar"
import FieldManager from "@/components/FieldManager"
import FieldEditor from "@/pages/FieldEditor"
import FieldDetails from "@/pages/FieldDetails"
import DronesManager from "@/components/DronesManager"
import DroneEditor from "@/pages/DroneEditor"
import DroneDetails from "@/pages/DroneDetails"
import MissionsManager from "@/components/MissionsManager"
import MissionCreator from "@/pages/MissionCreator"
import MissionPlanner from "@/pages/MissionPlanner"
import MissionDetails from "@/pages/MissionDetails"


function App() {
    return (
        <>
            <Navbar />
            <main className={`${styles.container} ${styles.main}`}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/fields" element={<FieldManager />} />
                    <Route path="/fields/new" element={<FieldEditor />} />
                    <Route path="/fields/:id" element={<FieldDetails />} />
                    <Route path="/drones" element={<DronesManager />} />
                    <Route path="/drones/new" element={<DroneEditor />} />
                    <Route path="/drones/:id" element={<DroneDetails />} />
                    <Route path="/missions" element={<MissionsManager />} />
                    <Route path="/missions/new" element={<MissionCreator />} />
                    <Route path="/missions/new/plan" element={<MissionPlanner />} />
                    <Route path="/missions/:id" element={<MissionDetails />} />
                </Routes>
            </main>
        </>
    )
}

export default App
