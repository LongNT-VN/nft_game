import React, { createContext, useContext, useEffect, useState } from 'react';
import { Contract, ethers } from 'ethers';
import Web3Modal from 'Web3Modal';
import { ADDRESS, ABI } from '../contract';
import { createEventListeners } from './createEventListeners';
import { useNavigate } from 'react-router-dom';

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
        if (!isEmptyObject(contract)) {
            createEventListeners({
                navigate,
                contract,
                provider,
                walletAddress,
                setShowAlert,
            });
        }
    }, [contract]);

    return (
        <GlobalContext.Provider
            value={{
                walletAddress,
                provider,
                contract,
                showAlert,
                setShowAlert,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};
const isEmptyObject = (obj: Object) =>
    Object.getPrototypeOf(obj) === Object.prototype &&
    Object.getOwnPropertyNames(obj).length === 0 &&
    Object.getOwnPropertySymbols(obj).length === 0;

export const useGlobalContext = () => useContext(GlobalContext);
