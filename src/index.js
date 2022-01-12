const express = require('express')
const app = express()
const PORT = process.env.PORT || 8080

const multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '/uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname) 
    }
})
const upload = multer({ storage: storage })

const fs = require('fs')
const tf = require('@tensorflow/tfjs-node')
const { nextTick } = require('process')

createFileSystem()
const model = loadModel()

app.listen(
    PORT,
    () => console.log(`it's alive on http://localhost:${PORT}`)
)

app.get('/', (req, res)=>{
    res.send("All Good")
})

app.post('/upload', upload.single('evaluate'), (req, res)=>{
    loadImage(req.file.path, (image)=>{
        transformImage(image, (transImage)=>{
            makePrediction(transImage, (prediction)=>{
                formatPrediction(prediction, (resObj)=>{
                    res.send(resObj)
                    fs.unlink(req.file.path, ()=>{})
                })
            })
        })
    })
});

function loadImage(path, callback) {
    fs.readFile(path, (err, imageBuffer)=>{
        if (err) {
            next(err)
        } else {
            callback(imageBuffer)
        }
    })
}

function transformImage(image, callback) {
    const decodedImage = tf.node.decodeImage(image)
    const casted = decodedImage.cast('int32')
    const expanded = casted.expandDims(0)
    callback(expanded)
}

function makePrediction(transImage, callback) {
    model.then((net)=>{
        net.executeAsync(transImage).then((prediction)=>{
            callback(prediction)
        }).catch((err)=>{
            next(err)
        })
    })
}

function formatPrediction(prediction, callback) {
    prediction[0].array().then((detection_multiclass_scores)=>{
        prediction[2].array().then((detection_boxes)=>{
            let boxes = detection_boxes[0];
            let scores = detection_multiclass_scores[0];
            boxes = boxes.filter((elem, ind)=>{
                return scores[ind][1]>0.75

            })
            scores = scores.filter((elem)=>{
                return elem[1]>0.75
            })
            callback({boxes, scores});
        })
    })
}

async function loadModel () {
    const handler = tf.io.fileSystem("model_build/model/tfjsexport/model.json")
    return await tf.loadGraphModel(handler);
}

function createFileSystem () {
    const dir  = './uploads'
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir)
    }
}



