import './App.css'
import * as tf from '@tensorflow/tfjs'
import { useState, useCallback, useMemo } from 'react'
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
    return await tf.loadLayersModel('https://hotdog-classifier.s3.us-west-1.amazonaws.com/model.json')
  })

  const [imgFile, setImgFile] = useState("");
  const [appState, setAppState] = useState("waiting");

  const evaluateImage = useCallback(async (file) => {
    return {
      boxes: [],
      scores: []
    }
  }, [])

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
          <img src={imgFile !== "" ? imgFile : cameraImg} className={appState} alt="Display Area"/>
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
