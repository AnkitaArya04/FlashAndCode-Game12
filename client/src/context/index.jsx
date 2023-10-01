import  React, {CreateContext,createContext,useContext, useEffect, useRef,useState} from 'react';
import {ethers} from 'react';
import Web3Modal from 'web3modal';
import {useNavigate} from 'react-router-dom';
import { createEventListeners } from './createEventListeners';


import {ABI, ADDRESS} from '../contract';

const GlobalContext = createContext();

export const GlobalContextProvider = ({children}) => {
    const [walletAddress, setWallestAddress] = useState('');
    const [provider, serProvider] = useState('');
    const [contract, serContract] = useState('');
    const [showAlert , setShowAlert]= useState({status:false,type:'info',message:''});
    const navigate = useNavigate();

    //*set the wallet address to the state

    const updateCurrentWalletAddress = async () => {
        const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts'});
         if(accounts) setWallestAddress(accounts[0]);
    }
    useEffect(()=>{
        updateCurrentWalletAddress();

        window.ethereum.on('accountsChanged',
        updateCurrentWalletAddress);
    },[]);

  //*set the smart contract the provider to the state
    useEffect(()=>{
        const setSmartContractAndProvider = async() => {
            const web3Modal = new Web3Modal();
            const connection = await web3Modal.connect();
            const newProvider = new ethers.Providers.WebProvider(connection);
            const signer = newProvider.getSigner();
            const newContract = new ethers.Contract(ADDRESS,ABI,signer);

            serProvider(newProvider);
            serContract(newContract);
        }
        setSmartContractAndProvider();
    },[contract]);

    useEffect(() =>{
        if(contract){
            createEventListeners({
                navigate, contract,provider,walletAddress,setShowAlert,
            })
        }
    },[])



    useEffect(()=> {
        if(showAlert?.status){
            const timer=setTimeout(()=> {
                setShowAlert({status:false,type:'info',message:''})
            },[5000])
            return ()=>setTimeout(timer);
        }
    },[showAlert]);



    return(
        <GlobalContext.Provider value={{
            contract, walletAddress,
            showAlert,setShowAlert,
        }}>
        {children}
        </ GlobalContext.Provider>
    )
}
export const useGlobalContext = () => useContext(GlobalContext);