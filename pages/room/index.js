import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar'
import Editor  from "@monaco-editor/react";
import { themes } from '../../utils/themes';
import { languages } from '../../utils/languages';
import Dropdown from '../../components/Dropdown';
import axios from 'axios';
import CircularLoader from '../../components/CircularLoader';
import DrawingBoard from '../../components/DrawingBoard';
import { io } from 'socket.io-client';

const BACKEND_URL = 'http://localhost:8000'

const socket = io(BACKEND_URL)

export default function Home() {

  const [code ,setCode] = useState("");
  const [input , setInput] = useState("");
  const [output , setOutput] = useState("");
  const [theme , setTheme] = useState({})
  const [language , setLanguage] = useState({})
  const [running , setRunning] = useState(false)
  const [editorValue , setEditorValue] = useState('');

  const API = axios.create( { baseURL : 'http://localhost:8000' } )

  useEffect(()=>{
    setTheme(themes[0])
    setLanguage(languages[0])
  } ,[])
  
  const handleCompileClick =()=>{
    console.log(code)
    console.log(input)
    setRunning(true)
    API.post('/compile' ,{
      code : code ,
      input :  input ,
      lang : language.value
    })
    .then(function(res){
      console.log("ok")
      console.log(res.data.data.output )
      setOutput(res.data.data.output)
      socket.emit('output-value-emit' , res.data.data.output)

      setRunning(false)
      
    })
    .catch(function(error){
      console.log(error)
      setRunning(false)
    })
    
  }

  const handleEditorValueChange =(value) => { 
    setCode(value)
    socket.emit('editor-value-emit' , value);
  }

  const handleInputChange = (value)=>{
    setInput(value)
    socket.emit('input-value-emit' , value)
  }

  const handleOutputChange = (value)=>{
    setOutput(value)
    socket.emit('output-value-emit' , value)
  }

  const handleLanguageChange = (language) => {
    // console.log("change")
    socket.emit('language-change-emit' , language)
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


  return (
    <div className='h-[100vh] w-[100vw]'>
        <Navbar/>
        <div className = 'main-container'>
          <div className='main-sub-container'>
              <div className='compiler-container '>
                {/* compiler */}
                <div className='compiler-options-bar relative flex justify-between items-center'>
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
                          {running ? <CircularLoader/> : 'Compile' } 
                        </button>
                    </div>
                </div>
                <div className='editor-container'>
                    <Editor
                        height="100%"
                        language = {language.value}
                        value={editorValue ? editorValue : language.defaultValue}
                        theme = {theme.value}
                        onChange={handleEditorValueChange}
                    />
                </div>
              </div>
          </div>
          <div className='main-sub-container'>
            <div className='board-container'>
              {/* board */}
              <DrawingBoard socket={socket}/>
            </div>
            <div className='io-container-main'>
              <div className='io-container-sub flex flex-col '>
                {/* input */}
                <div className='h-[15%] w-full max-h-[30px] font-bold flex items-center pl-[10px]'>Input</div>
                <div className='grow'>
                    <Editor theme = {theme.value} value={input} onChange = {val => handleInputChange(val)}/>
                </div>
              </div>
              <div className='io-container-sub flex flex-col'>
                <div className='h-[15%] w-full max-h-[30px] font-bold flex items-center pl-[10px]'>Output   </div>
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
