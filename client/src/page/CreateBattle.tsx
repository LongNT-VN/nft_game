import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CustomButton, CustomInput, GameLoad } from '../components';
import PageHOC from '../components/PageHOC';
import { useGlobalContext } from '../context';
import styles from '../styles';

const CreateBattle = () => {
    const { contract, battleName, gameData, setBattleName, setErrorMessage } =
        useGlobalContext();
    const [waitBattle, setWaitBattle] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (gameData?.activeBattle?.battleStatus === 1) {
            navigate(`/battle/${gameData?.activeBattle?.name}`);
        }
        if (gameData?.activeBattle?.battleStatus === 0) {
            setWaitBattle(true);
        }
    }, [gameData]);

    const handleClick = async () => {
        if (!battleName || !battleName.trim()) return null;
        try {
            await contract.createBattle(battleName, {
                gasLimit: 20000,
            });
            setWaitBattle(true);
        } catch (error) {
            setErrorMessage(error);
        }
    };
    return (
        <>
            {waitBattle && <GameLoad />}
            <div className="flex flex-col mb-5">
                <CustomInput
                    label="Battle"
                    placeholder="Enter battle name"
                    value={battleName}
                    handleValueChange={setBattleName}
                />
                <CustomButton
                    title="Create Battle"
                    handleClick={handleClick}
                    restStyles="mt-6"
                />
            </div>
            <p
                className={styles.infoText}
                onClick={() => navigate('/join-battle')}
            >
                Or join already existing battle
            </p>
        </>
    );
};

export default PageHOC(
    CreateBattle,
    <>Create Battle</>,
    <>Connect your wallet to play game!</>
);
