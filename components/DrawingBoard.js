import React , {useState , useRef, useEffect} from 'react'

export default function DrawingBoard() {
  
  const canvasRef= useRef(null)
  const contextRef = useRef (null)
  const [isDrawing , setIsDrawing] = useState(false);

  const prepareCanvas = () => {
    const canvas = canvasRef.current ;
    canvas.height = canvas.parentNode.clientHeight
    canvas.width = canvas.parentNode.clientWidth
    
    const context = canvas.getContext("2d")
    context.lineCap = "round"
    context.lineWidth = 3;
    context.strokeStyle = "black"
    contextRef.current = context; 

  }

  useEffect(()=>{
    prepareCanvas()
  } ,[])


  const startDrawing = ({nativeEvent}) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  }

  const finishDrawing = () => {
    setIsDrawing(false);
    contextRef.current.closePath()   
  }

  const draw = ({nativeEvent}) => {
    
    if(!isDrawing) return ;
    
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  }
  
  const clearCanvas = () => {
    const canvas = canvasRef.current ;
    const context = canvas.getContext("2d")
    context.fillStyle = "white"
    context.fillRect(0 , 0 , canvas.width , canvas.height )
  }

  return (
    <div className=' h-full w-full relative'>
        <canvas
            className='cursor-crosshair'
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseUp={finishDrawing}
            onMouseMove={draw}
        />
        <button onClick={clearCanvas} className="absolute top-[2%] right-[2%] bg-red-300 rounded-[5px] font-bold p-[5px]">clear</button>
    </div>
  )
}
