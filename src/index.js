const tf = require('@tensorflow/tfjs-node');
const multer = require('multer');
const fs = require('fs')
const upload = multer({dest: 'uploads/'});
const express = require('express');
const app = express();
const PORT = 8080;

const labelMap = {
    1:{name:'ThumbsUp', color:'red'},
    2:{name:'ThumbsDown', color:'yellow'},
    3:{name:'ThankYou', color:'lime'},
    4:{name:'LiveLong', color:'blue'},
}

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
        callback(imageBuffer);
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
            prediction[4].array().then((detection_boxes)=>{
                prediction[7].array().then((detection_multiclass_scores)=>{
                    let boxes = detection_boxes[0];
                    let scores = detection_multiclass_scores[0];
                    boxes = boxes.filter((elem, ind)=>{
                        return scores[ind][1]>0.9 ||
                               scores[ind][2]>0.9 || 
                               scores[ind][3]>0.9 ||
                               scores[ind][4]>0.9 
                    })
                    scores = scores.filter((elem)=>{
                        return elem[1]>0.9 ||
                               elem[2]>0.9 ||
                               elem[3]>0.9 ||
                               elem[4]>0.9
                    })
                    callback({boxes, scores});
                })
            })
        })
    })
}

async function loadModel () {
    const handler = tf.io.fileSystem("model/model.json")
    return await tf.loadGraphModel(handler);
}

