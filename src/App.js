import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import './App.css';


const app = new Clarifai.App({
 apiKey: 'f008492833be4ff38eb02a290c926449'
});


const particlesOption = {
particles: {
  number: {
    value: 150,
    density: {
      enable: true, 
      value_area: 800
      }
    },
    interactivity: {
          events: {
              onhover: {
                  enable: true,
                  mode: "repulse"
                }
            }
      },
  }
}
    
class App extends Component {
  constructor(){
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false
    }
  }

  calculateFaceLocation = (data) => {
    const faceCordinate = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: faceCordinate.left_col * width,
      topRow: faceCordinate.top_row * height,
      rightCol: width - (faceCordinate.right_col * width),
      bottomRow: height - (faceCordinate.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    console.log(box);
    this.setState({box: box});
  }
  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onSubmit = () => {
    this.setState({imageUrl: this.state.input});
    app.models
    .predict(
      Clarifai.FACE_DETECT_MODEL, 
      this.state.input)
    .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
    //   console.log(response.outputs[0].data.regions[0].region_info.bounding_box); do something with response
    .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({isSignedIn: false});
    } else if (route === 'home') {
      this.setState({isSignedIn: true});
    }
    this.setState({route: route});
  }


  render() {
  const { isSignedIn, route, box, imageUrl } = this.state;
    return (
      <div className="App">
        <Particles className='particles'
        params={particlesOption}
        />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
          { route === 'home' 
          ? <div> 
                 <Logo />
                <Rank />
                <ImageLinkForm onInputChange={this.onInputChange} onSubmit={this.onSubmit}/>
                <FaceRecognition box={box} imageUrl={imageUrl}/> 
            </div>
           : (
              route === 'signin' 
              ? <SignIn onRouteChange={this.onRouteChange}/>
              : <Register onRouteChange={this.onRouteChange}/>
            )
          }
      </div>
    );
  }
}

export default App;
