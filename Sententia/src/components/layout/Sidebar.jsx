import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, BrainCircuit, Shield, LogOut } from 'lucide-react';
import styles from './Sidebar.module.css';

const Sidebar = () => {
    return (
        <aside className={styles.sidebar}>
            <div className={styles.logo}>
                <BrainCircuit size={28} color="var(--color-primary)" />
                Sententia
            </div>

            <nav className={styles.nav}>
                <NavLink
                    to="/"
                    className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
                >
                    <LayoutDashboard size={20} />
                    Dashboard
                </NavLink>

                <NavLink
                    to="/assessment"
                    className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
                >
                    <BrainCircuit size={20} />
                    Assessment center
                </NavLink>

                <NavLink
                    to="/admin"
                    className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
                >
                    <Users size={20} />
                    Team Analytics
                </NavLink>

                <NavLink
                    to="/compliance"
                    className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
                >
                    <Shield size={20} />
                    Compliance
                </NavLink>
            </nav>

            <div className={styles.userProfile}>
                <div className={styles.avatar}>YA</div>
                <div className={styles.userInfo}>
                    <span className={styles.userName}>Yammy A.</span>
                    <span className={styles.userRole}>Candidate</span>
                </div>
                <button style={{ marginLeft: 'auto', color: '#9ca3af' }}>
                    <LogOut size={18} />
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
