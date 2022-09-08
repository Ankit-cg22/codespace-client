import React , {useState} from 'react'
import {useRouter} from 'next/router' 

export default function Navbar({roomId}) {
  const router = useRouter()
  const [showCopied , setCopied] = useState(false)
  const showCopy = () => {
    setCopied(true)
    setTimeout(()=>{
      setCopied(false)
    } , 1500)
  }
  const handleCopyClick =()=>{
    navigator.clipboard.writeText(roomId)
    showCopy()
  }
  return (
    <div className='navbar-main flex justify-center items-center bg-gray-700 text-gray-300'>
        <div className='text-[2rem] font-bold cursor-pointer ' onClick={()=> router.push('/')} >
            CodeSpace
        </div>
        {roomId && 
          <div className='flex justify-between items-center font-bold relative'>
            {showCopied && <div className='bg-cyan-200 p-[5px] rounded-[5px] text-black absolute right-[10%] bottom-[-120%] z-10'>Copied</div>}
            <button className='bg-cyan-200 p-[5px] rounded-[5px] mx-[10px] text-black' onClick={handleCopyClick}>Copy Room ID</button>
          </div>
        }
    </div>
  )
}
