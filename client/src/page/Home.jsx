
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHOC , CustomInput,CustomButton} from '../components';
import { useGlobalContext } from '../context';
const Home = ()=>{
  const {contract, walletAddress,setShowAlert} = useGlobalContext();
  const [playerName, setPlayerName] = useState('');
  const navigate = useNavigate();


  const handleClick = async () => {
    try{
      
      const playerExists = await contract.isPlayer(walletAddress);



      if(!playerExists){
        await contract.registerPlayer(playerName, playerName);
        setShowAlert({
          status:true,
          type:"info",
          message: `${playerName} is being summoned!`
        })
      }
    }catch(error){
      console.log(error,error.message)
      setShowAlert({
        status:true,
        type:"failure",
        message: "Something went wrong!"
      })
    }
  }


  useEffect(() => {
    const checkForPlayerToken = async () => {
      const playerExists = await contract.isPlayer(walletAddress);
      const playerTokenExists = await contract.isPlayerToken(walletAddress);
      console.log({
        playerExists,
        playerTokenExists
      })


      if(playerExists && playerTokenExists) navigate('/create-battle')
    }

    if(contract) checkForPlayerToken();
  },[contract]);

  return (
    <div className="flex flex-col">
       <CustomInput 
          Label="Name"
          placeholder="Enter your player name"
          value={playerName}
          handleValueChange={setPlayerName}
       />

      <CustomButton

        title="Register"
        handleClick={(handleClick)=>{}}
        restStyles="mt-6"
      />



    </div>
  )
};
export default  PageHOC(
  Home,
  <>Welcome to EthersWar <br />a Web3 NFT Card Game</>,
  <>Connect your wallet to start playing <br /> the ultimate web3 battle Card Game</>
);