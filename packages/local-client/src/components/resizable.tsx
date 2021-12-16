import { useEffect, useState } from "react"
import { ResizableBox, ResizableBoxProps } from "react-resizable"

import "./resizable.css"

interface ResizableProps {
  direction: "horizontal" | "vertical"
}

const Resizable: React.FC<ResizableProps> = ({ direction, children }) => {
  let resizableBoxProps: ResizableBoxProps
  const [innerHeight, setInnerHeight] = useState(window.innerHeight)
  const [innerWidth, setInnerWidth] = useState(window.innerWidth)
  const [width, setWidth] = useState(innerWidth * 0.498)

  useEffect(() => {
    let timer: any

    const listener = () => {
      if (timer) {
        clearTimeout(timer)
      }
      timer = setTimeout(() => {
        setInnerHeight(window.innerHeight)
        setInnerWidth(window.innerWidth)

        if (window.innerWidth * 0.498 < width) {
          setWidth(window.innerWidth * 0.97)
        }
      }, 100)
    }

    window.addEventListener("resize", listener)

    return () => {
      window.removeEventListener("resize", listener)
    }
  }, [width])

  if (direction === "horizontal") {
    resizableBoxProps = {
      className: "resize-horizontal",
      minConstraints: [innerWidth * 0.2, Infinity],
      maxConstraints: [innerWidth * 0.97, Infinity],
      height: Infinity,
      width: width,
      resizeHandles: ["e"],
      onResizeStop: (event, data) => {
        setWidth(data.size.width)
      },
    }
  } else {
    resizableBoxProps = {
      minConstraints: [Infinity, 50],
      maxConstraints: [Infinity, innerHeight * 0.97],
      height: innerHeight * 0.65,
      width: Infinity,
      resizeHandles: ["s"],
    }
  }

  return <ResizableBox {...resizableBoxProps}>{children}</ResizableBox>
}

export default Resizable
