import React from 'react';
import { useNavigate } from 'react-router-dom';
import { player01, player02 } from '../assets';
import { useGlobalContext } from '../context';
import styles from '../styles';
import CustomButton from './CustomButton';

const GameLoad = () => {
    const navigate = useNavigate();
    const { walletAddress } = useGlobalContext();
    return (
        <div className={`${styles.flexBetween} ${styles.gameLoadContainer}`}>
            <div className={styles.gameLoadBtnBox}>
                <CustomButton
                    title="Choose Battleground"
                    handleClick={() => navigate('/battleground')}
                    restStyles="mt-6"
                ></CustomButton>
            </div>
            <div className={`flex-1 ${styles.flexCenter} flex-col`}>
                <h1 className={`${styles.headText} text-center`}>
                    Waiting for a <br /> worthy opponent...
                </h1>
                <p className={styles.gameLoadText}>
                    Protup: while you are waiting, choose your preferred
                    battleground
                </p>
                <div className={styles.gameLoadPlayersBox}>
                    <div className={`${styles.flexCenter} flex-col`}>
                        <img
                            src={player01}
                            className={styles.gameLoadPlayerImg}
                        />
                        <p className={styles.gameLoadText}>
                            {walletAddress.slice(0, 30)}
                        </p>
                    </div>
                    <h2 className={styles.gameLoadVS}></h2>
                    <div className={`${styles.flexCenter} flex-col`}>
                        <img
                            src={player02}
                            className={styles.gameLoadPlayerImg}
                        />
                        <p className={styles.gameLoadText}>??</p>
                    </div>
                </div>
                <div className="mt-10">
                    <p className={`${styles.infoText} text-center mb-5`}>OR</p>

                    <CustomButton
                        title="Join other battles"
                        handleClick={() => navigate('/join-battle')}
                    />
                </div>
            </div>
        </div>
    );
};

export default GameLoad;
