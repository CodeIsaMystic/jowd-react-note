import { useEffect, useRef } from "react"

import "./preview.css"

interface PreviewProps {
  code: string
  error: string
}

const html = `
  <html class="bg" >
    <head></head>
    <body>
      <div id="root" style="color: #d4d4d4;font-family: Fira code;" ></div>
      <script>
        const handleError = (error) => {
          const root = document.querySelector('#root')
          root.innerHTML = '<div style="position: absolute; top: 10px; left: 10px; color: #ec5f67; font-family: Fira code;"><h4>Runtime Error</h4>' + error + '</div>'
          console.error(error)
        }

        window.addEventListener('error', (event) => {
          event.preventDefault()
          handleError(event.error)
        })

        window.addEventListener('message', (event) => {
          try {
            eval(event.data)
          } catch (error) {
            handleError(error)
          }
        }, false)
      </script>
    </body>
  </html>
  `

const Preview: React.FC<PreviewProps> = ({ code, error }) => {
  const iframe = useRef<any>()

  useEffect(() => {
    // reset the iframe srcDoc by updating with content
    iframe.current.srcdoc = html
    // will let execute the reset before if needed
    setTimeout(() => {
      iframe.current.contentWindow.postMessage(code, "*")
    }, 50)
  }, [code])

  /* console.log(error)*/

  return (
    <div className="preview-wrapper">
      <iframe
        title="code preview"
        ref={iframe}
        sandbox="allow-scripts"
        srcDoc={html}
      />
      {error && (
        <div className="preview-error">
          <h4>Syntax Error</h4>
          {error}
        </div>
      )}
    </div>
  )
}

export default Preview
