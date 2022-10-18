import React , {useState , useEffect} from 'react'
import axios from 'axios'
import { BACKEND_URL } from '../utils/constants';
import Navbar from '../components/Navbar';
import CodeSnippetModal from '../components/CodeSnippetModal';

export default function ProfilePage() {

  const [userData , setUserData] = useState("")
  const [savedSnippets , setSavedSnippets] = useState("")
  const [currentSnippet , setCurrentSnippet] = useState({})
  const [openModal , setOpenModal] = useState(false)

  const API = axios.create( { baseURL : BACKEND_URL } )

  const [notification , setNotification] = useState('')

  function createNotification(msg){
    setNotification(msg)
    setTimeout(()=>{
      setNotification("");
    },3000)
  } 

  async function getData(){
    try {
        API.get(
            '/profile-page' , 
            {
                headers : {
                    token : localStorage.getItem('token')
                }
            }
        )
        .then(function(response){
            setUserData(response.data.user)
            setSavedSnippets(response.data.savedSnippets)
            
        })
        .catch(function(error){
            console.log(error.message)
        })
    } catch (error) {
        console.log(error.response.data.message)
    }
  }

  useEffect(()=>{
    getData()   
  },[])

  const handleOpenSnippet = (id) =>{
    const snippet = savedSnippets.filter(function(snippet){
        return snippet.snippet_id === id ;
    })[0]
    setCurrentSnippet(snippet)
    setOpenModal(true)
  }

  const handleDeleteSnippet = (id) =>{

    if(!confirm(`Are you sure to delete the snippet?`)) return;

    const newSnippets = savedSnippets.filter(function(snippet){
        return snippet.snippet_id !== id ;
    })
    setSavedSnippets(newSnippets)
    API.delete(`/profile-page/delete-snippet/${id}`)
    .then(function(response){
        
        createNotification('Snippet Deleted')
    })
    .catch(function(error){
        console.log(error)
    })
  }

  
  return (
    <div className='h-[100vh] w-[100vw]  bg-gray-900'>
        <Navbar/>
        <div className='max-w-[1400px] m-auto w-full h-[90%] p-[10px] '>
            <div className='text-white w-full md:w-[50%] m-auto text-center'>
                {userData ?
                    <>
                        <div className='mb-[20px]'>Welcome {userData.name}</div>
                        <div>
                            <div>Saved Snippets</div>
                            <div>
                                {savedSnippets.map(ss=>(
                                    <div key={ss.snippet_id}  className="overflow-hidden bg-gray-700 my-[10px] rounded-[10px] cursor-pointer w-[100%] flex justify-between items-center ">
                                        <div className=' flex justify-between items-center w-[90%]  p-[10px] px-[15px]' onClick={()=>handleOpenSnippet(ss.snippet_id)}>
                                            <div className='w-[60%] md:w-[40%] text-left'>{ss.title}</div>
                                            <div className='text-center w-[20%] '>{ss.lang}</div>
                                            <div></div>
                                        </div>
                                        <div className='w-[15%] md:w-[10%] p-[10px] h-full px-[15px] bg-red-700 flex justify-center items-center' onClick={()=>handleDeleteSnippet(ss.snippet_id)}>
                                            <svg width="24" height="24" className='text-white' xmlns="http://www.w3.org/2000/svg"><path fill="white" fillRule="evenodd" clipRule="evenodd" d="M6 7a1 1 0 0 1 1 1v11a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V8a1 1 0 1 1 2 0v11a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V8a1 1 0 0 1 1-1z" /><path fillRule="evenodd" clipRule="evenodd" d="M10 8a1 1 0 0 1 1 1v8a1 1 0 1 1-2 0V9a1 1 0 0 1 1-1zM14 8a1 1 0 0 1 1 1v8a1 1 0 1 1-2 0V9a1 1 0 0 1 1-1zM4 5a1 1 0 0 1 1-1h14a1 1 0 1 1 0 2H5a1 1 0 0 1-1-1zM8 3a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2H9a1 1 0 0 1-1-1z" fill="white"/></svg>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                :
                    <div>You are not authorized to view the page </div>
                }
            </div>
        </div>
        <CodeSnippetModal
            open = {openModal}
            setOpen ={setOpenModal}
            snippet={currentSnippet}
            setSavedSnippets ={setSavedSnippets}
            savedSnippets = {savedSnippets}
            createNotification = {createNotification}
        />
        {notification && 
                <div className='z-10 w-[300px] p-[20px] bg-green-200 font-bold flex justify-center items-center rounded-[10px] absolute bottom-[5%] right-[1%] '>
                  {notification} 
                </div>
            }
    </div>
  )
}
