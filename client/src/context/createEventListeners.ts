import { ethers } from 'ethers';
import { ABI } from '../contract';

const AddNewEvent = (eventFilter, provider, cb) => {
    provider.removeListener(eventFilter);
    provider.on(eventFilter, (logs) => {
        const parsedLog = new ethers.utils.Interface(ABI).parseLog(logs);
        cb(parsedLog);
    });
};

export const createEventListeners = ({
    navigate,
    contract,
    provider,
    walletAddress,
    setShowAlert,
}) => {
    const NewPlayerEventListener = contract.filters.NewPlayer();
    console.log({ NewPlayerEventListener });
    AddNewEvent(NewPlayerEventListener, provider, ({ args }) => {
        if (walletAddress === args.owner) {
            setShowAlert({
                status: true,
                type: 'success',
                message: 'create success',
            });
        }
    });
};
