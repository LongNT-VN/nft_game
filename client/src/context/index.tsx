import Web3Modal from 'Web3Modal';
import { Contract, ethers } from 'ethers';
import React, {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { ABI, ADDRESS } from '../contract';
import { isEmptyObject } from '../utils/checkObjectEmpty';
import { GetParams } from '../utils/onboard';
import { createEventListeners } from './createEventListeners';

const GlobalContext = createContext({
    walletAddress: '',
    provider: {} as ethers.providers.Web3Provider,
    contract: {} as Contract,
    showAlert: {} as { status: boolean; type: string; message: string },
    setShowAlert: ({
        status,
        type,
        message,
    }: {
        status: boolean;
        type: string;
        message: string;
    }) => {
        return;
    },
    battleName: '',
    setBattleName: (battleName: string) => {
        return;
    },
    gameData: {} as {
        players: never[];
        pendingBattles: any;
        activeBattle: any;
    },
    battleGround: 'bg-astral',
    setBattleGround: (battleGround: string) => {
        return;
    },
    errorMessage: {} as { reason: string },
    setErrorMessage: ({ reason }: { reason: string }) => {
        return;
    },
    player1Ref: {},
    player2Ref: {},
    updateCurrentWalletAddress: () => {
        return;
    },
});
export const GlobalContextProvider = ({ children }: { children: any }) => {
    const [walletAddress, setWalletAddress] = useState('');
    const [provider, setProvider] = useState(
        {} as ethers.providers.Web3Provider
    );
    const [contract, setContract] = useState({} as Contract);
    const [showAlert, setShowAlert] = useState({
        status: false,
        type: 'info',
        message: '',
    });
    const [battleName, setBattleName] = useState('');
    const [gameData, setGameData] = useState({
        players: [],
        pendingBattles: [],
        activeBattle: null,
    });
    const [updateGameData, setUpdateGameData] = useState(0);
    const [battleGround, setBattleGround] = useState('');
    const [step, setStep] = useState(1);
    const [errorMessage, setErrorMessage] = useState({ reason: '' });
    const player1Ref = useRef({});
    const player2Ref = useRef({});

    const navigate = useNavigate();
    const updateCurrentWalletAddress = async () => {
        const accounts = await window?.ethereum?.request({
            method: 'eth_accounts',
        });
        if (accounts) {
            setWalletAddress(accounts[0]);
        }
    };
    useEffect(() => {
        const battleGroundFromLocalStorage =
            localStorage.getItem('battleGround');
        if (battleGroundFromLocalStorage)
            setBattleGround(battleGroundFromLocalStorage);
    }, []);

    useEffect(() => {
        const resetParams = async () => {
            const currentStep = await GetParams();
            setStep(currentStep.step);
            window?.ethereum?.on('chainChanged', () => resetParams());
            window?.ethereum?.on('accountsChanged', () => resetParams());
        };
    }, []);

    useEffect(() => {
        setSmartContractAndProvider();
    }, []);
    useEffect(() => {
        updateCurrentWalletAddress();
        window?.ethereum?.on('accountsChanged', updateCurrentWalletAddress);
    }, []);

    const setSmartContractAndProvider = async () => {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const newProvider = new ethers.providers.Web3Provider(connection);
        const signer = newProvider.getSigner();
        const newContract = new ethers.Contract(ADDRESS, ABI, signer);
        setProvider(newProvider);
        setContract(newContract);
    };

    useEffect(() => {
        if (showAlert?.status) {
            const timer = setTimeout(() => {
                setShowAlert({ status: false, type: 'info', message: '' });
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [showAlert]);

    useEffect(() => {
        if (errorMessage) {
            const parsedErrorMessage = errorMessage?.reason?.split(
                'execution reverted: '
            )[1];
            if (parsedErrorMessage) {
                setShowAlert({
                    status: true,
                    type: 'failure',
                    message: parsedErrorMessage,
                });
            }
        }
    }, [errorMessage]);

    useEffect(() => {
        if (step !== -1 && !isEmptyObject(contract)) {
            createEventListeners({
                navigate,
                contract,
                provider,
                walletAddress,
                setShowAlert,
                setUpdateGameData,
                player1Ref,
                player2Ref,
            });
        }
    }, [contract, step]);

    // Set the game data to the state

    useEffect(() => {
        const fetchGameData = async () => {
            const fetchedBattles = await contract.getAllBattles();
            const pendingBattles = fetchedBattles.filter(
                (battle) => battle.battleStatus === 0
            );
            let activeBattle = null;
            fetchedBattles.forEach((battle) => {
                if (
                    battle.players.find(
                        (player) =>
                            player.toLowerCase() ===
                            walletAddress.toLocaleLowerCase()
                    )
                ) {
                    if (battle.winner.startsWith('0x00')) {
                        activeBattle = battle;
                    }
                }
            });
            setGameData({
                players: [],
                pendingBattles: pendingBattles.slice(1),
                activeBattle,
            });
        };
        if (contract) fetchGameData();
    }, [contract, updateGameData]);

    return (
        <GlobalContext.Provider
            value={{
                walletAddress,
                provider,
                contract,
                showAlert,
                setShowAlert,
                battleName,
                setBattleName,
                gameData,
                battleGround,
                setBattleGround,
                errorMessage,
                setErrorMessage,
                player1Ref,
                player2Ref,
                updateCurrentWalletAddress,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = () => useContext(GlobalContext);
