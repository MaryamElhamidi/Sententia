import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import styles from './MainLayout.module.css';

const MainLayout = () => {
    return (
        <div className={styles.layout}>
            <Sidebar />
            <main className={styles.main}>
                <Header />
                <div className={styles.content}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default MainLayout;
