import React from 'react';
import styles from './Button.module.css';

const Button = ({
    children,
    variant = 'primary',
    fullWidth = false,
    className = '',
    ...props
}) => {
    return (
        <button
            className={`${styles.button} ${styles[variant]} ${fullWidth ? styles.fullWidth : ''} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
