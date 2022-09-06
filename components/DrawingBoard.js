import React, { useState, useRef, useEffect } from 'react'

export default function DrawingBoard({ socket }) {

  const canvasRef = useRef(null)
  const contextRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false);

  const prepareCanvas = () => {
    const canvas = canvasRef.current;
    canvas.height = canvas.parentNode.clientHeight
    canvas.width = canvas.parentNode.clientWidth

    const context = canvas.getContext("2d")
    context.lineCap = "round"
    context.lineWidth = 3;
    context.strokeStyle = "black"
    contextRef.current = context;

  }

  useEffect(() => {
    prepareCanvas()
  }, [])


  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
    socket.emit('mouse-move-emit', { offsetX, offsetY })
  }

  const finishDrawing = () => {
    setIsDrawing(false);
    contextRef.current.closePath()
  }

  const draw = ({ nativeEvent }) => {

    if (!isDrawing) return;

    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
    socket.emit('draw-emit', { offsetX, offsetY })
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d")
    context.fillStyle = "white"
    context.fillRect(0, 0, canvas.width, canvas.height)
  }

  socket.on('mouse-move-broadcast', value => {
    const { offsetX, offsetY } = value;
    contextRef.current?.beginPath();
    contextRef.current?.moveTo(offsetX, offsetY);
  })
  console.log(isDrawing)
  socket.on('draw-broadcast', value => {
    const { offsetX, offsetY } = value;
    contextRef.current?.lineTo(offsetX, offsetY);
    contextRef.current?.stroke();
  })

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
