const tf = require('@tensorflow/tfjs-node');
const multer = require('multer');
const fs = require('fs')
const upload = multer({dest: 'uploads/'});
const express = require('express');
const app = express();
const PORT = 8080;

const model = loadModel();

app.listen(
    PORT,
    () => console.log(`it's alive on http://localhost:${PORT}`)
)

app.get('/evaluate/test', async (req, res)=>{
    const imageBuffer = fs.readFileSync('uploads/1f37da6c0ccecc1f7c02a887620c6b94.jpeg')

    const img = tf.node.decodeImage(imageBuffer)
    const resized = tf.image.resizeBilinear(img, [640,480])
    const casted = resized.cast('int32')
    const expanded = casted.expandDims(4)
    const obj = await (await model).executeAsync(expanded)

    res.send(obj)
});

app.post('/evaluate/fileUpload', upload.single('evaluate'), (req, res)=>{
    res.status(200).send(req.file)
});

async function loadModel () {
    const handler = tf.io.fileSystem("model/model.json")
    try {
        const mdl = await tf.loadGraphModel(handler);
        return mdl;
    } catch {
        throw 'Could Not Load Model';
    }
}

