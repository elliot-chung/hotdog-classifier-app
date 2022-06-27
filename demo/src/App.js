import './App.css'
import * as tf from '@tensorflow/tfjs'
import { useState, useCallback, useMemo, useRef } from 'react'
import { Icon } from '@iconify/react'
import cameraImg from './camera.svg'
import check from './hotdog_check.svg'
import not from './not_x.svg'


function App() {
  return (
    <div className="App">
      <CameraButton></CameraButton>
    </div>
  );
}

function CameraButton() {
  const model = useMemo(async () => {
    const net = await tf.loadGraphModel('https://hotdog-classifier.s3.us-west-1.amazonaws.com/model.json')
    return net
  }, [])

  const [imgFile, setImgFile] = useState("")
  const [appState, setAppState] = useState("waiting")
  const imgRef = useRef(null)

  const evaluateImage = useCallback(async () => {
    if (imgRef.current.currentSrc.match(/blob/g) === null) return
    const imgTensor = tf.browser.fromPixels(imgRef.current)
    const resizedImgTensor = tf.image.resizeBilinear(imgTensor, [224, 224])
    const imgTensor4D = resizedImgTensor.expandDims(0)

    const predictions = (await model).predict(imgTensor4D)

    const prediction = predictions.flatten()
    const predictionSigmoid = prediction.sigmoid()
    const predictionValues = tf.zerosLike(predictionSigmoid).where(predictionSigmoid.less(0.5), 1)
    
    console.log(predictionValues.dataSync())


    if (predictionValues.dataSync()[0] === 1) {
      setAppState("not")
    } else {
      setAppState("hotdog")
    }
  }, [ model ])

  const handleFile = useCallback((evt) => {
    if(evt.target.files.length !== 0) { 
      setImgFile(URL.createObjectURL(evt.target.files[0]))
      setAppState("loading")
    } else {
      setImgFile("")
      setAppState("waiting")
    }
  }, [ setImgFile, setAppState ])

  return (
      <div className="camera-btn">
        <label>
          <img ref={imgRef} src={imgFile !== "" ? imgFile : cameraImg} onLoad={evaluateImage} className={appState} alt="Display Area"/>
          {appState === "hotdog" && (<img src={check} className="state_ui" alt="State UI"/>)}
          {appState === "not" && (<img src={not} className="state_ui" alt="State UI"/>)}  
          {appState === "loading" && <Icon icon="eos-icons:loading" color="white" height="80" className="state_ui"/>}
          <input disabled={appState === "loading"} 
                 type="file" 
                 accept="image/jpeg, capture=camera" 
                 onChange={handleFile}
                 />
        </label>    
        {imgFile === "" && (<p> Choose an Image to Identify </p>)}
      </div>
    )
}

export default App
