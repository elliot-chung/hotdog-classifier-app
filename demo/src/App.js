import './App.css'
import axios from 'axios'
import { useState, useCallback } from 'react'
import cameraImg from './camera.svg'

function App() {
  return (
    <div className="App">
      <CameraButton></CameraButton>
    </div>
  );
}

function CameraButton() {
  

  const [imgFile, setImgFile] = useState("");
  const [apiState, setApiState] = useState("waiting");

  const uploadFile = useCallback(async (file) => {
    const formdata = new FormData()
    formdata.append('evaluate', file)

    const results = await axios({
      url: 'https://hotdog-classifier-api.herokuapp.com/upload', 
      method: "POST", 
      data: formdata
    })
    return results
  }, [])

  const handleFile = useCallback( async (evt) => {
    if(evt.target.files.length !== 0) { 
      setImgFile(URL.createObjectURL(evt.target.files[0]))
      setApiState("loading")
      console.log("loading")
      const results = await uploadFile(evt.target.files[0])
      console.log(results)
      if (results.status >= 400) {
        setApiState("broken")
      } else if (results.data.scores.length === 0) {
        setApiState("not")
        console.log("not")
      } else {
        setApiState("hotdog")
        console.log("hotdog")
      }
    } else {
      setImgFile("")
      setApiState("waiting")
    }
  }, [uploadFile])

  // Credit where credit is due
  // https://stackoverflow.com/questions/572768/styling-an-input-type-file-button?rq=1  
  return (
      <div className="camera-btn">
        <label>
          <img src={imgFile !== "" ? imgFile : cameraImg} alt="Display Area"/>
          <input disabled={apiState === "loading"} 
                 type="file" 
                 accept="image/jpeg, image/png, capture=camera" 
                 onChange={handleFile}
                 />
        </label>    
        {imgFile === "" && (<p> Choose an Image to Identify </p>)}
      </div>
    )
}

export default App
