import './App.css';
import cameraImg from './camera.svg';

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
  return (
      <div className="camera-btn">
        <label htmlFor="file-upload">
          <img src={cameraImg} alt="Camera"></img>
          <input id="file-upload" type="file" accept="image/*;capture=camera"></input>
          Choose an Image to Identify
        </label>    
      </div>
    )
}

export default App;
