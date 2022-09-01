import Navbar from '../components/Navbar'
import { useState } from 'react';
import { useRouter } from 'next/router'
import { io } from 'socket.io-client';
const socket = io('http://localhost:8000/')
export default function Home() {
  const router = useRouter();
  const [inputVal , setInputVal] = useState("")
  const handleInputChange = (msg) => {
      console.log(msg)
      setInputVal(msg)
      console.log(inputVal);
      socket.emit("input-change-client" , msg);
  }
  socket.on('input-change-server' , inputVal => {
    setInputVal(inputVal)
  })
  return (
    <div className='h-[100vh] w-[100%] mark'>
        <Navbar/>
        <div className = "cursor-pointer" onClick={()=>router.push('/room')}> Go to room</div>
        <input value={inputVal} onChange = {(e) => handleInputChange(e.target.value)}/>
    </div>
  )
}
