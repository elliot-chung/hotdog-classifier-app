const tf = require('@tensorflow/tfjs-node');
const multer = require('multer');
const fs = require('fs')
const upload = multer({dest: 'uploads/'});
const express = require('express');
const app = express();
const PORT = 8080;

let model = loadModel();

app.listen(
    PORT,
    () => console.log(`it's alive on http://localhost:${PORT}`)
)

app.get('/evaluate/test', (req, res)=>{
    loadImage('uploads/1f37da6c0ccecc1f7c02a887620c6b94.jpeg', (image)=>{
        transformImage(image, (transImage)=>{
            makePrediction(transImage, (prediction)=>{
                res.send(prediction)
            })
        })
    })
})

app.post('/evaluate/fileUpload', upload.single('evaluate'), (req, res)=>{
    res.status(200).send(req.file)
});

function loadImage(path, callback) {
    fs.readFile(path, (err, imageBuffer)=>{
        const image = tf.node.decodeImage(imageBuffer)
        callback(image);
    })
}

function transformImage(image, callback) {
    const resized = tf.image.resizeBilinear(image, [640,480])
    const casted = resized.cast('int32')
    const expanded = casted.expandDims(0)
    callback(expanded)
}

function makePrediction(transImage, callback) {
    model.then((net)=>{
        net.executeAsync(transImage).then((prediction)=>{
            callback(prediction)
        })
    })
}

async function loadModel () {
    const handler = tf.io.fileSystem("model/model.json")
    return await tf.loadGraphModel(handler);
}

