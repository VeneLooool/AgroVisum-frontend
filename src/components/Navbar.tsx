import { NavLink } from "react-router-dom"
import styles from "@/styles/Layout.module.css"

export default function Navbar() {
    return (
        <nav className={styles.navbar}>
            <NavLink to="/">Главная</NavLink>
            <NavLink to="/fields">Поля</NavLink>
            <NavLink to="/drones">Дроны</NavLink>
            <NavLink to="/missions">Миссии</NavLink>
        </nav>
    )
}
