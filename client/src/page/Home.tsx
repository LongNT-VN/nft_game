import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CustomButton } from '../components';
import CustomInput from '../components/CustomInput';
import PageHOC from '../components/PageHOC';
import { GlobalContextProvider, useGlobalContext } from '../context';

const Home = () => {
    const { contract, walletAddress, showAlert, setShowAlert } =
        useGlobalContext();
    const [playerName, setPlayerName] = useState('');
    const handleClick = async () => {
        try {
            const playerExists = await contract.isPlayer(walletAddress);
            if (!playerExists) {
                await contract.registerPlayer(playerName, playerName, {
                    gasLimit: 500000,
                });
                setShowAlert({
                    status: true,
                    type: 'info',
                    message: `${playerName} come to the game!`,
                });
            }
        } catch (error) {
            setShowAlert({
                status: true,
                type: 'info',
                message: 'Error',
            });
        }
    };
    const navigate = useNavigate();
    useEffect(() => {
        const checkForPlayerToken = async () => {
            const playerExists = await contract.isPlayer(walletAddress);
            const playerTokenExists = await contract.isPlayerToken(walletAddress);
            if(playerExists && playerTokenExists) navigate('/create-battle')
        };
    }, [contract]);

    return (
        <div className="flex flex-col">
            <CustomInput
                label="Name"
                placeholder="Enter your player name"
                value={playerName}
                handleValueChange={setPlayerName}
            />
            <CustomButton
                title="Register"
                handleClick={handleClick}
                restStyles="mt-6"
            />
        </div>
    );
};

export default PageHOC(
    Home,
    <>Welcome</>,
    <>Connect your wallet to play game!</>
);
