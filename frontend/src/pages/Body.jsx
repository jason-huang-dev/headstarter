import {Hero, Services, Features, LandingNavigation }from '../components/landing';
import {Footer} from '../components';
// import Benefits from '../components/Benefits';
// <Benefits /> 

/**
 * Body component that renders the main content of the landing page.
 * 
 * This component displays the main sections of the landing page, including:
 * - `LandingNavigation`: The navigation bar for the landing page.
 * - `Hero`: The hero section at the top of the page.
 * - `Services`: The section showcasing available services.
 * - `Features`: The section highlighting features.
 * - `Footer`: The footer at the bottom of the page.
 * 
 * @component
 * @returns {JSX.Element} The rendered Body component with landing page content.
 */
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