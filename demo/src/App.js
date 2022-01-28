import './App.css'
import axios from 'axios'
import { useState } from 'react'
import cameraImg from './camera.svg'

function App() {
  return (
    <div className="App">
      <CameraButton></CameraButton>
    </div>
  );
}

function CameraButton() {
  // Credit where credit is due
  // https://stackoverflow.com/questions/572768/styling-an-input-type-file-button?rq=1  

  const [imgFile, setImgFile] = useState("");
  const [apiState, setApiState] = useState("waiting");

  const handleFile = (evt) => {
    if(evt.target.files.length !== 0) { 
      setImgFile(URL.createObjectURL(evt.target.files[0]))
      uploadFile()
    } else {
      setImgFile("")
    }
  }

  const uploadFile = async () => {
    const formdata = new FormData()
    formdata.append('evaluate', imgFile)

    const results = await axios({
      url: 'https://hotdog-classifier-api.herokuapp.com/upload', 
      method: "POST", 
      data: formdata
    })
    console.log(results)
  }

  return (
      <div className="camera-btn">
        <label>
          <img src={imgFile !== "" ? imgFile : cameraImg} alt="Display Area"/>
          <input type="file" accept="image/png, image/jpeg, capture=camera" onChange={handleFile}/>
        </label>    
        {imgFile === "" && (<p> Choose an Image to Identify </p>)}
      </div>
    )
}

export default App
