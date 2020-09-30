import React, {Component} from 'react'
import { Footer } from '../../components/footer/Footer'
import { Header } from '../../components/header/Header'
import '../../index.css'
import threeEntryPoint from '../../components/canvas/main';
// import Hud from '../../components/canvas/hud'

class ThreeContainer extends Component {
  componentDidMount() {
    threeEntryPoint(this.threeRootElement);
  }
  render () {
    return (
      <>
      <div id="canvas"><div id="map" ref={element => this.threeRootElement = element} /> </div>
      <div id="debug">
        <div>x:<span id="x"></span></div>
        <div>y:<span id="y"></span></div>
        <div>z:<span id="z"></span></div>
        <div>fps:<span id="fps"></span></div>
        <div>i/o:<span id="io"></span></div>
      </div>
      </>
  );
}
}


export const Home = () => {
  return (
    <div className="Home">
      <Header/>
      <ThreeContainer/>
      <Footer/>
    </div>
  )
}
