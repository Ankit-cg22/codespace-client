import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar'
import Editor  from "@monaco-editor/react";
import { themes } from '../../utils/themes';
import { languages } from '../../utils/languages';
import Dropdown from '../../components/Dropdown';

export default function Home() {

  const [theme , setTheme] = useState({})
  const [language , setLanguage] = useState({})

  useEffect(()=>{
    setTheme(themes[0])
    setLanguage(languages[0])
  } ,[])
  console.log(language)
  return (
    <div className='h-[100vh] w-[100%] mark'>
        <Navbar/>
        <div className = 'main-container'>
          <div className='main-sub-container'>
              <div className='compiler-container '>
                {/* compiler */}
                <div className='compiler-options-bar relative flex justify-between items-center'>
                    <div className='flex justify-around items-center w-[50%] absolute right-0 '>
                        <Dropdown
                            data = {themes}
                            val = {theme}
                            setVal = {setTheme}
                        />
                        <Dropdown
                            data = {languages}
                            val = {language}
                            setVal = {setLanguage}
                        />
                    </div>
                </div>
                <div className='editor-container'>
                    <Editor
                        height="100%"
                        language = {language.value}
                        value={language.defaultValue}
                        theme = {theme.value}
                    />
                </div>
              </div>
          </div>
          <div className='main-sub-container'>
            <div className='board-container'>
              {/* board */}
              
            </div>
            <div className='io-container-main'>
              <div className='io-container-sub flex flex-col '>
                {/* input */}
                <div className='h-[15%] w-full max-h-[30px] font-bold flex items-center pl-[10px]'>Input</div>
                <div className='grow'>
                    <Editor theme = {theme.value}/>
                </div>
              </div>
              <div className='io-container-sub flex flex-col'>
                <div className='h-[15%] w-full max-h-[30px] font-bold flex items-center pl-[10px]'>Output</div>
                <div className='grow'>
                    <Editor theme = {theme.value}/>
                </div>
              </div>
            </div>
          </div>
          
        </div>
    </div>
  )
}
