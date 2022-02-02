# Hotdog Classifier API
## [Link to Demo Website](https://ec-2018.github.io/hotdog-classifier-api/)
  
  
## How It's Built
1. Collected 100 images of hotdogs off the internet using [tzutalin's](https://github.com/tzutalin) [labelImg](https://github.com/tzutalin/labelImg) for labelling. 
2. Took advantage of the [TF2 model zoo](https://github.com/tensorflow/models/blob/master/research/object_detection/g3doc/tf2_detection_zoo.md) to perform transfer learning on an image detection CNN model. I trained the model using Google Colab and when finished, I exported the model in the TensorflowJS format. I followed much of this [tutorial](https://github.com/nicknochnack/TFODCourse) from [Nicholas Renotte](https://www.youtube.com/channel/UCHXa4OpASJEwrHrLeIzw7Yg) for this step. 
3. Wrote an express app that uses tfjs-node library to make evaluations using the model on a server. 
4. Deployed the app on Heroku.
5. Wrote a frontend React application to interact with the API.
6. Deployed the frontend app to github pages. 

## Improvement to be Made
As it stands, while the model is able to accurately detect the presence of a hotdog it is quite prone to false positives. I'd like to eventually train a new model trying some of the following to increase the model's accuracy.
1. Collect more images of hotdogs.
2. Collect random images specifically for a 'not hotdog' label. (This kinda goes against the spirit of the original joke, but it'll make the model more accurate nonetheless)
3. Try transferring from another pre-trained model. 

## Tools
Tensorflow/TensorflowJS  
NodeJS  
Express framework  
Heroku  
React

## Inspiration
Did I spend actual hours of my life recreating a mid joke from a five year old show? Absolutely.   
[![Alt text](https://img.youtube.com/vi/ACmydtFDTGs/0.jpg)](https://www.youtube.com/watch?v=ACmydtFDTGs)

