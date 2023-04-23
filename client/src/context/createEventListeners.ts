import { ethers } from 'ethers';
import { ABI } from '../contract';
import { playAudio, sparcle } from '../utils/animation';
import { defenseSound } from '../assets';

const emptyAccount = '0x0000000000000000000000000000000000000000';
const AddNewEvent = (eventFilter, provider, cb) => {
    provider.removeListener(eventFilter);
    provider.on(eventFilter, (logs) => {
        const parsedLog = new ethers.utils.Interface(ABI).parseLog(logs);
        cb(parsedLog);
    });
};

const getCoords = (cardRef) => {
    const { left, top, width, height } =
        cardRef.current.getBoundingClientRect();
    return { pageX: left + width / 2, pageY: top + height / 2.25 };
};
export const createEventListeners = ({
    navigate,
    contract,
    provider,
    walletAddress,
    setShowAlert,
    setUpdateGameData,
    player1Ref,
    player2Ref,
}) => {
    const NewPlayerEventListener = contract.filters.NewPlayer();
    AddNewEvent(NewPlayerEventListener, provider, ({ args }) => {
        if (walletAddress === args.owner) {
            setShowAlert({
                status: true,
                type: 'success',
                message: 'create success',
            });
        }
    });

    const NewGameTokenEventFilter = contract.filters.NewGameToken();
    AddNewEvent(NewGameTokenEventFilter, provider, ({ args }) => {
        console.log('New game token created!', args);
        if (walletAddress.toLowerCase() === args.owner.toLowerCase()) {
            setShowAlert({
                status: true,
                type: 'success',
                message: 'Player game token has been successfully created!',
            });
            navigate('/create-battle');
        }
    });

    const NewBattleListener = contract.filters.NewBattle();
    AddNewEvent(NewBattleListener, provider, ({ args }) => {
        if (
            walletAddress.toLowerCase() === args.player1.toLowerCase() ||
            walletAddress.toLowerCase() === args.player2.toLowerCase()
        ) {
            navigate(`/battle/${args.battleName}`);
        }
        setUpdateGameData((prevUpdateGameData) => prevUpdateGameData + 1);
    });

    const BattleMoveEventFilter = contract.filters.BattleMove();
    AddNewEvent(BattleMoveEventFilter, provider, ({ args }) => {
        console.log('Battle move initiated!', args);
    });

    const RoundEndedEventFilter = contract.filters.RoundEnded();
    AddNewEvent(RoundEndedEventFilter, provider, ({ args }) => {
        for (let i = 0; i < args.damagedPlayers.length; i++) {
            if (args.damagedPlayers[i] !== emptyAccount) {
                if (args.damegedPlayers[i] === walletAddress) {
                    sparcle(getCoords(player1Ref));
                } else if (args.damagedPlayers[i] !== walletAddress) {
                    sparcle(getCoords(player2Ref));
                }
            } else {
                playAudio(defenseSound);
            }
        }
        setUpdateGameData((prevUpdateGameData) => prevUpdateGameData + 1);
    });
    const BattleEndedEventFilter = contract.filters.BattleEnded();
    AddNewEvent(BattleEndedEventFilter, provider, ({ args }) => {
        console.log('BattleEnded', args, walletAddress);
        if (walletAddress.toLowerCase() === args.winner.toLowerCase()) {
            setShowAlert({
                status: true,
                type: 'success',
                message: 'You won!',
            });
        } else if (walletAddress.toLowerCase() === args.loser.toLowerCase()) {
            setShowAlert({
                status: true,
                type: 'failure',
                message: 'You lost!',
            });
        }
        navigate('/create-battle');
    });
};
