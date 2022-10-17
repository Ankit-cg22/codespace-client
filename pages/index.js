import Navbar from '../components/Navbar'
import { useState } from 'react';
import { useRouter } from 'next/router'
import axios from 'axios'
import CircularLoader from '../components/CircularLoader';
import { socket } from '../utils/socket';
import { BACKEND_URL } from '../utils/constants';

export default function Home() {
  const router = useRouter();
  const API = axios.create( { baseURL : BACKEND_URL } )

  const [enteredRoomId , setEnteredRoomId] = useState();
  const [errorMessage , setErrorMessage] = useState()
  const [creatingRoom ,setCreatingRoom]= useState(false);
  const [joiningRoom ,setJoiningRoom]= useState(false);
  

  const createRoom = () => {
    setCreatingRoom(true)
    API.get('/userAction/createRoom')
    .then(function(res){
      const roomId = res.data.roomId
      if(roomId){
        socket.emit('join-room' , roomId)
        router.push(`/room/${roomId}`)
      }
      else{
        createErrorMessage("Room could not be created !")
      }
      setCreatingRoom(false)

    })
    .catch(function(err){ 
      console.log(err.message)
      setCreatingRoom(false)

    })
  }
  
  function createErrorMessage(msg){
      setErrorMessage(msg)
      setTimeout(()=>{
        setErrorMessage("");
      },3000)
  }

  const handleJoinRoomClick = () => {
    if(!enteredRoomId) 
    {
      createErrorMessage("Please enter room id ")
      return ;
    }
    setJoiningRoom(true)
    API.post('/userAction/join-room' , {roomId : enteredRoomId})
    .then(function(res){
      const roomId = res.data.roomId
      socket.emit('join-room' , roomId)
      router.push(`/room/${roomId}`)
      setJoiningRoom(false)
    })
    .catch(function(err){
      const errorMessage = err.response.data.message
      createErrorMessage(errorMessage)
      setJoiningRoom(false)
    })
  }



  return (
    <div className='h-[100vh] w-[100vw]  bg-gray-900'>
        <Navbar/>
        <div className='w-full h-[90%] flex justify-center items-center flex-col relative'>

          {errorMessage && 
            <div className='w-[300px] p-[20px] bg-red-200 font-bold flex justify-center items-center rounded-[10px] absolute bottom-[5%] right-[1%] '>
               {errorMessage} 
            </div>
          }

          <div className='home-form-container '>
            <button className='home-button' onClick={createRoom}>{creatingRoom ? <CircularLoader/> : "Create Room"}</button>
          </div>
          <div className='home-form-container'>
            <input placeholder='Enter the room id' className='max-w-[300px] w-[80%] md:w-[80%] mb-[20px] p-[10px] outline-none border-[2px] border-cyan-200 rounded-[5px]' onChange={(e)=>setEnteredRoomId(e.target.value)} />
            <button className='home-button' onClick={handleJoinRoomClick}>
              {joiningRoom ? <CircularLoader/> : "Join Room"}
            </button>
          </div>
        </div>
    </div>
  )
}
