import Navbar from '../components/Navbar'
import { useRouter } from 'next/router'
export default function Home() {
  const router = useRouter();
  return (
    <div className='h-[100vh] w-[100%] mark'>
        <Navbar/>
        <div className = "cursor-pointer" onClick={()=>router.push('/room')}> Go to room</div>
    </div>
  )
}
