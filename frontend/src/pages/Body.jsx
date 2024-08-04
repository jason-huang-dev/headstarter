import {Hero, Services, Features, LandingNavigation }from '../components/landing';
import {Footer} from '../components';
// import Benefits from '../components/Benefits';
// <Benefits /> 


function Body() {
  return (
    <>
    <LandingNavigation/>
    <div className='mt-[5em] pt-[5rem] lg:pt-[6em]'>
    <Hero/>
    <Services />
    <Features />
    <Footer />
    </div>

    </>
  )
}

export default Body