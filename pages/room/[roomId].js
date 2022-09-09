import React, { useEffect, useState , useRef} from 'react';
import Navbar from '../../components/Navbar'
import Editor  from "@monaco-editor/react";
import { themes } from '../../utils/themes';
import { languages } from '../../utils/languages';
import Dropdown from '../../components/Dropdown';
import axios from 'axios';
import CircularLoader from '../../components/CircularLoader';
import DrawingBoard from '../../components/DrawingBoard';
import { socket } from '../../utils/socket';
import { useRouter } from 'next/router';
import freeice from 'freeice'
const BACKEND_URL = 'http://localhost:8000'
import { ReactDOM } from 'react';

export default function Home() {
  const router = useRouter()

  const [code ,setCode] = useState("");
  const [input , setInput] = useState("");
  const [output , setOutput] = useState("");
  const [theme , setTheme] = useState({})
  const [language , setLanguage] = useState({})
  const [loading , setLoading] = useState(false)
  const [editorValue , setEditorValue] = useState('');
  const [roomId , setRoomId] = useState('')
  const [audioStreams ,setAudioStreams] = useState([])
  const audioRef = useRef()
  const secondAudioRef = useRef()
  const [paused , setPaused] = useState(false)
  const [mutedIncoming , setMutedIncoming] = useState(false)
  const peers=[]
  const streamRef = useRef()
  let myPeer ;
  useEffect(()=>{

    if(!router.isReady) return 

    setTheme(themes[0])
    setLanguage(languages[0])
    setRoomId(router.query.roomId)
    socket.emit('join-room' , router.query.roomId)

  } ,[router.isReady])
  useEffect(() => {
    if(!router.isReady) return 
      import('peerjs').then(({ default: Peer }) => {
        myPeer = new Peer(undefined, {
        host: '/',
        port: '3001'
      })

      myPeer.on('open' , id=>{
        socket.emit('join-room', router.query.roomId ,id)
      })
      
    });
    
  }, [router.isReady])

  const API = axios.create( { baseURL : 'http://localhost:8000' } )

  
  const handleCompileClick =()=>{
    console.log(code)
    console.log(input)
    setLoading(true)
    API.post('/compile' ,{
      code : code ,
      input :  input ,
      lang : language.value
    })
    .then(function(res){
      console.log("ok")
      console.log(res.data.data.output )
      setOutput(res.data.data.output)
      socket.emit('output-value-emit' , res.data.data.output , roomId)

      setLoading(false)
      
    })
    .catch(function(error){
      console.log(error)
      setLoading(false)
    })
    
  }

  const handleEditorValueChange =(value) => { 
    setCode(value)
    setEditorValue(value)
    socket.emit('editor-value-emit' , value , roomId);
  }

  const handleInputChange = (value)=>{
    setInput(value)
    socket.emit('input-value-emit' , value , roomId)
  }

  const handleOutputChange = (value)=>{
    setOutput(value)
    socket.emit('output-value-emit' , value , roomId)
  }

  const handleLanguageChange = (language) => {
    // console.log("change")
    socket.emit('language-change-emit' , language , roomId)
  }

  //======
  socket.on('editor-value-broadcast', value => {
    setCode(value)
    setEditorValue(value)
  })

  socket.on('input-value-broadcast' , value => {
    setInput(value)
  })

  socket.on('output-value-broadcast' , value => {
    setOutput(value)
  })

  socket.on('language-change-broadcast' , language => {
    setLanguage(language)
  })

  socket.on('user-connected' , userId => {
    console.log(userId)
  })
  
  useEffect(()=>{
    navigator.mediaDevices.getUserMedia({
      audio:true,
    }).then(stream => {
      streamRef.current = stream
      audioRef.current.srcObject = streamRef.current

      myPeer.on('call' , call=>{
        call.answer(stream)
        call.on('stream' , userVideoStream=>{
          secondAudioRef.current.srcObject = userVideoStream
        })
      })

      socket.on('user-connected' , userId => {
        console.log("oi")
        connectToNewUser(userId , stream)
      })

    })
  
  }, [])

  function connectToNewUser(userId , stream){
    const call = myPeer.call(userId , stream)
    call.on('stream' , userVideoStream => {
      secondAudioRef.current.srcObject = userVideoStream
    })
    call.on('close', () => {
      secondAudioRef.current.srcObject = null
    })
  
    peers[userId] = call
  }

  socket.on('user-disconnected' , userId=>{
    console.log(userId)
    if(peers[userId]) peers[userId].close()
  } )

  const handlePauseClick = () => {
    if(paused){
      streamRef.current.getAudioTracks().forEach(function(track) {
        track.enabled = true;
    });
    }
    else {
      streamRef.current.getAudioTracks().forEach(function(track) {
        track.enabled = false;
    });
    }
    setPaused(!paused)
  }

  return (
    <div className='h-[100vh] w-[100vw] '>
        <Navbar roomId={roomId} handlePauseClick={handlePauseClick} setMutedIncoming={setMutedIncoming} mutedIncoming={mutedIncoming} paused={paused}/>
        <div  className='h-[0] mark'>
            <audio muted  autoPlay ref={audioRef}></audio>
            <audio muted={mutedIncoming} autoPlay ref={secondAudioRef}></audio>
        </div>
        <div className = 'main-container border-[2px] border-gray-700'>
          <div className='main-sub-container'>
              <div className='compiler-container '>
                {/* compiler */}
                <div className='compiler-options-bar relative flex justify-between items-center bg-white'>
                    <div className='flex justify-around items-center w-[100%] md:w-[50%] absolute right-0 '>
                        <Dropdown
                            data = {themes}
                            val = {theme}
                            setVal = {setTheme}
                        />
                        <Dropdown
                            data = {languages}
                            val = {language}
                            setVal = {setLanguage}
                            handleLanguageChange = {handleLanguageChange}
                        />

                        <button className='w-[90px] h-[30px] text-center rounded-[5px] cursor-pointer border-[2px] border-gray-500 font-bold flex justify-center items-center' onClick={handleCompileClick}>
                          {loading ? <CircularLoader/> : 'Compile' } 
                        </button>
                    </div>
                </div>
                <div className='editor-container'>
                    <Editor
                        height="100%"
                        language = {language.value}
                        value={editorValue || language.defaultValue}
                        theme = {theme.value}
                        onChange={handleEditorValueChange}
                    />
                </div>
              </div>
          </div>
          <div className='main-sub-container'>
            <div className='board-container bg-white border-[2px] border-l-gray-400 border-b-gray-400'>
              {/* board */}
              <DrawingBoard socket={socket} roomId={roomId}/>
            </div>
            <div className='io-container-main'>
              <div className='io-container-sub flex flex-col '>
                {/* input */}
                <div className='h-[15%] w-full max-h-[30px] font-bold flex items-center pl-[10px] bg-white' >Input</div>
                <div className='grow'>
                    <Editor theme = {theme.value} value={input} onChange = {val => handleInputChange(val)}/>
                </div>
              </div>
              <div className='io-container-sub flex flex-col'>
                <div className='h-[15%] w-full max-h-[30px] font-bold flex items-center pl-[10px] bg-white'>Output   </div>
                <div className='grow'>
                    <Editor theme = {theme.value}  value={output} onChange={val => handleOutputChange(val)}/>
                </div>
              </div>
            </div>
          </div>
          
        </div>
    </div>
  )
}
