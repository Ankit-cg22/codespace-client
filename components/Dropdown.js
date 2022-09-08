import React, {useState} from 'react'

export default function Dropdown({data , val ,setVal , handleLanguageChange}) {

    const [openDropdown , setOpenDropdown] = useState(false)

    const handleOptionClick = (d) =>{ 
        setVal(d)
        setOpenDropdown(false)
        if(handleLanguageChange) handleLanguageChange(d)
    }

  return (
    <div className='relative'>
        <div className='w-[90px] h-[30px] flex justify-between items-center px-[5px] rounded-[5px] cursor-pointer border-[2px] border-gray-500' onClick={()=>setOpenDropdown(!openDropdown)}>
            <div className='w-[50%] pl-[5px] font-bold'>
                {val.label}
            </div>
            <div className=' w-[25%] flex justify-center items-center'>
                <svg height="25px" xmlns="http://www.w3.org/2000/svg" version="1.2" viewBox="-300 302 16 16" ><switch><g ><path d="M-296.49 308.5h9l-4.51 4.99-4.49-4.99z"/></g></switch></svg>
            </div>

        </div>
        {openDropdown &&
            <div className='bg-white border-gray-700 border-[1px] h-[fit-content] max-h-[150px] overflow-auto w-[90px] rounded-[5px] absolute top-[32px] z-[10]'>
                {data.map((d , idx) => {
                    return(
                        <div key={idx} className=' py-[6px] font-bold w-full cursor-pointer hover:bg-gray-200 text-center' onClick={() => handleOptionClick(d)}>
                            {d.label}
                        </div>
                    )
                })}
            </div>
        }
    </div>
  )
}
