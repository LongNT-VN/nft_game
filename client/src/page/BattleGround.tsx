import React from 'react';
import { useNavigate } from 'react-router-dom';
import { battlegrounds } from '../assets';
import { Alert } from '../components';
import { useGlobalContext } from '../context';
import styles from '../styles';

const BattleGround = () => {
    const { showAlert, setShowAlert, setBattleGround } = useGlobalContext();
    useGlobalContext();
    const navigate = useNavigate();
    const handleBattleGroundChoice = (battleGround) => {
        setBattleGround(battleGround.id);
        localStorage.setItem('battleGround', battleGround.id);
        setShowAlert({
            status: true,
            type: 'info',
            message: `${battleGround.name} is battle ready!`,
        });
        setTimeout(() => {
            navigate(-1);
        }, 1000);
    };
    return (
        <div className={`${styles.flexCenter} ${styles.battlegroundContainer}`}>
            {showAlert?.status && (
                <Alert type={showAlert?.type} message={showAlert?.message} />
            )}
            <h1 className={`${styles.headText} text-center`}>
                Choose your <span className="text-siteViolet"> Battle </span>{' '}
                Ground
            </h1>
            <div
                className={`${styles.flexCenter} ${styles.battleGroundsWrapper}`}
            >
                {battlegrounds.map((battleGround) => (
                    <div
                        key={battleGround.id}
                        className={`${styles.flexCenter} ${styles.battleGroundCard}`}
                        onClick={() => handleBattleGroundChoice(battleGround)}
                    >
                        <img
                            src={battleGround.image}
                            alt="battleGround"
                            className={styles.battleGroundCardImg}
                        />
                        <div className="info absolute">
                            <p className={styles.battleGroundCardText}>
                                {battleGround.name}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BattleGround;
