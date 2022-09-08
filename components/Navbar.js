import React from 'react'
import {useRouter} from 'next/router' 

export default function Navbar({roomId}) {
  const router = useRouter()
  return (
    <div className='navbar-main flex justify-center items-center'>
        <div className='text-[2rem] font-bold cursor-pointer ' onClick={()=> router.push('/')} >
            CodeSpace
        </div>
        {roomId && 
          <div className='flex justify-between items-center font-bold'>
            <div>Room ID : {roomId}</div>
            <button className='bg-cyan-200 p-[5px] rounded-[5px] mx-[10px]' onClick={()=>navigator.clipboard.writeText(roomId)}>Copy</button>
          </div>
        }
    </div>
  )
}
