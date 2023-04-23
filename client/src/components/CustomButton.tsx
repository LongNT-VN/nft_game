import React from 'react';
import styles from '../styles';

const CustomButton = ({
    title,
    handleClick,
    restStyles = '',
}: {
    title: string;
    handleClick: any;
    restStyles?: string;
}) => {
    return (
        <button
            type="button"
            className={`${styles.btn} ${restStyles}`}
            onClick={handleClick}
        >
            {title}
        </button>
    );
};

export default CustomButton;
