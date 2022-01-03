const tf = require('@tensorflow/tfjs-node');
const multer = require('multer');
const upload = multer({dest: 'uploads/'});
const express = require('express');
const app = express();
const PORT = 8080;

app.listen(
    PORT,
    () => console.log(`it's alive on http://localhost:${PORT}`)
)

app.get('/evaluate/test', async (req, res)=>{
    let model;
    try {
        const handler = tf.io.fileSystem("model/model.json")
        model = await tf.loadGraphModel(handler)
    } catch {
        res.status(404)
    }
    console.log(model);
    res.send({"bing":"chilling"})
});

app.post('/evaluate/fileUpload', upload.single('evaluate'), (req, res)=>{
    res.status(200).send(req.file)
});

