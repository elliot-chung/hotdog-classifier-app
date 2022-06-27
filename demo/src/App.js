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

  const [imgFile, setImgFile] = useState("");
  const [appState, setAppState] = useState("waiting");
  const imgRef = useRef(null);

  const evaluateImage = useCallback(async (file) => {
    console.log(model)
    const imgTensor = tf.browser.fromPixels(imgRef.current)
    const resizedImgTensor = tf.image.resizeBilinear(imgTensor, [256, 256])
    const imgTensor4D = resizedImgTensor.expandDims(0)
    const predictions = (await model).predict(imgTensor4D)

    console.log(predictions.dataSync())
    
    const prediction = predictions.flatten()
    const predictionSigmoid = prediction.sigmoid()
    const output = predictionSigmoid.where(predictionSigmoid.greater(0.5), 1, 0)
    const predictionValues = await output.data()
    
    


    return {
      data : {
        boxes: [],
        scores: []
      }
    }
  }, [model])

  const handleFile = useCallback( async (evt) => {
    if(evt.target.files.length !== 0) { 
      setImgFile(URL.createObjectURL(evt.target.files[0]))
      setAppState("loading")
      const results = await evaluateImage(evt.target.files[0])
      console.log(results)
      if (results.status >= 400) {
        setAppState("broken")
      } else if (results.data.scores.length === 0) {
        setAppState("not")
      } else {
        setAppState("hotdog")
      }
    } else {
      setImgFile("")
      setAppState("waiting")
    }
  }, [evaluateImage])

  // Credit where credit is due: styling an input element
  // https://stackoverflow.com/questions/572768/styling-an-input-type-file-button?rq=1  

  return (
      <div className="camera-btn">
        <label>
          <img ref={imgRef} src={imgFile !== "" ? imgFile : cameraImg} className={appState} alt="Display Area"/>
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
