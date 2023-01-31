import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles';
import { heroImg, logo } from '../assets';
import { useGlobalContext } from '../context';
import { Alert } from './index';
const arrat = ['sad', 'ssf'];
const PageHOC = (Component, title, description) => () => {
    const { showAlert } = useGlobalContext();
    const navigate = useNavigate();
    return (
        <div className={styles.hocContainer}>
            {showAlert?.status && (
                <Alert type={showAlert.type} message={showAlert.message} />
            )}
            <div className={styles.hocContentBox}>
                <img
                    src={logo}
                    alt="logo"
                    className={styles.hocLogo}
                    onClick={() => {
                        navigate('/');
                    }}
                ></img>
                <div className={styles.hocBodyWrapper}>
                    <div className="flex flex-row w-full">
                        <h1 className={`flex ${styles.headText} head-text`}>
                            {title}
                        </h1>
                    </div>
                    <p className={`${styles.normalText} my-10`}>
                        {description}
                    </p>
                    <Component />
                </div>
                <p className={styles.footerText}>From Long Nguyen with love</p>
            </div>
            <div className="flex flex-1">
                <img
                    src={heroImg}
                    alt="hero image"
                    className="w-full xl:h-full object-cover"
                ></img>
            </div>
        </div>
    );
};

export default PageHOC;
