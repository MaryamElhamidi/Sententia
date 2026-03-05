import React from 'react';
import { Search, Bell, Settings, Calendar } from 'lucide-react';
import styles from './Header.module.css';

const Header = () => {
    const currentDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <header className={styles.header}>
            <div className={styles.searchContainer}>
                <Search size={18} className={styles.searchIcon} />
                <input
                    type="text"
                    placeholder="Search anything..."
                    className={styles.searchInput}
                />
            </div>

            <div className={styles.actions}>
                <div className={styles.dateDisplay}>
                    {currentDate}
                </div>

                <button className={styles.iconBtn}>
                    <Calendar size={20} />
                </button>

                <button className={styles.iconBtn}>
                    <Bell size={20} />
                </button>

                <button className={styles.iconBtn}>
                    <Settings size={20} />
                </button>
            </div>
        </header>
    );
};

export default Header;
