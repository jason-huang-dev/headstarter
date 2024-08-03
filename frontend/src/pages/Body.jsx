import Hero from '../components/landing/Hero';
import Highlights from '../components/landing/Highlights';
import Features from '../components/landing/Features';
import Footer from '../components/Footer';

import LandingNavigation from '../components/landing/LandingNavigation';
// import Benefits from '../components/Benefits';
// <Benefits /> 


function Body() {
  return (
    <>
    <LandingNavigation/>
    <div className='mt-[5em] pt-[5rem] lg:pt-[6em]'>
    <Hero/>
    <Highlights />
    <Features />
    <Footer />
    </div>

    </>
  )
}

export default Body