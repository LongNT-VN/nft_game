import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CustomButton } from '../components';
import PageHOC from '../components/PageHOC';
import { useGlobalContext } from '../context';
import styles from '../styles';

const JoinBattle = () => {
    const navigate = useNavigate();
    const {
        contract,
        gameData,
        setShowAlert,
        setBattleName,
        walletAddress,
        setErrorMessage,
    } = useGlobalContext();
    useEffect(() => {
        if (gameData?.activeBattle?.battleStatus === 1) {
            navigate(`/battle/${gameData?.activeBattle?.name}`);
        }
    }, [gameData]);
    const handleClick = async (battleName: string) => {
        setBattleName(battleName);
        try {
            await contract.joinBattle(battleName, {
                gasLimit: 20000,
            });
            setShowAlert({
                status: true,
                type: 'success',
                message: `Joining ${battleName}`,
            });
        } catch (error) {
            setErrorMessage(error);
        }
    };
    return (
        <>
            <h2 className={styles.joinBattleTitle}>Available Battles:</h2>
            <div className={styles.joinContainer}>
                {gameData.pendingBattles.length ? (
                    gameData.pendingBattles
                        .filter(
                            (battle) => !battle.players.includes(walletAddress)
                        )
                        .map((battle, index) => (
                            <div
                                key={battle.name + index}
                                className={styles.flexBetween}
                            >
                                <p className={styles.joinBattleTitle}>
                                    {index + 1}. {battle.name}
                                </p>
                                <CustomButton
                                    title="Join"
                                    handleClick={() => handleClick(battle.name)}
                                />
                            </div>
                        ))
                ) : (
                    <p className={styles.joinLoading}></p>
                )}
            </div>
            <p
                className={styles.infoText}
                onClick={() => navigate('/create-battle')}
            >
                Or create a new battle
            </p>
        </>
    );
};

export default PageHOC(
    JoinBattle,
    <>Create Battle</>,
    <>Connect your wallet to play game!</>
);
