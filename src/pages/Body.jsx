import { useState } from 'react'
import './Body.css'
import { Link } from 'react-router-dom';
import InfographicsIcon from '../assets/infographics.svg'
import OneIcon from '../assets/one.svg'
import Slider from 'react-slick';


function Main() {

  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleAccordion = (index) => {
    if (expandedIndex === index) {
      setExpandedIndex(null); // Collapse if already expanded
    } else {
      setExpandedIndex(index); // Expand if not expanded
    }
  };
  
  return (
    <>
    <div className='container'>
      <div className='catchphrase'>
        <h2>Lorem ipsum dolor sit amet, 
        consectetur adipiscing elit.</h2>
        <h5 className='under-catchphrase'>Duis aute irure dolor in reprehenderit 
        in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</h5>
      </div>
      <Link to="/signin" className='catchphrase-btn'>Try it</Link>
    </div>  

    <div className='cards-container'>
            <div className='card'>
                <img className='infographics-icon' src={InfographicsIcon} alt="Infographics Icon" />
                <div className='card-content'>
                    <h3>Lorem ipsum dolor</h3>
                    <p>Duis aute irure dolor in reprehenderit in voluptate velit 
                      esse cillum dolore eu fugiat nulla pariatur. Duis aute irure 
                      dolor in reprehenderit in voluptate velit esse cillum 
                      dolore eu fugiat nulla pariatur</p>
                </div>
            </div>
            <div className='card'>
                <div className='card-content'>
                <img className='infographics-icon small-display-icon' src={InfographicsIcon} alt="Infographics Icon" />
                    <h3>Lorem ipsum dolor</h3>
                    <p>Duis aute irure dolor in reprehenderit in voluptate velit 
                      esse cillum dolore eu fugiat nulla pariatur. Duis aute irure 
                      dolor in reprehenderit in voluptate velit esse cillum 
                      dolore eu fugiat nulla pariatur</p>
                </div>
                <img className='infographics-icon middle-icon' src={InfographicsIcon} alt="Infographics Icon" />
            </div>
            <div className='card'>
                <img className='infographics-icon' src={InfographicsIcon} alt="Infographics Icon" />
                <div className='card-content'>
                    <h3>Lorem ipsum dolor</h3>
                    <p>Duis aute irure dolor in reprehenderit in voluptate velit 
                      esse cillum dolore eu fugiat nulla pariatur. Duis aute irure 
                      dolor in reprehenderit in voluptate velit esse cillum 
                      dolore eu fugiat nulla pariatur</p>
                </div>
            </div>
        </div>

    <div className='container features-container'>
      <h2 className='section-header'>Features</h2>
      <div className='bullets'>
          <div className='feature'>
            <img className='number-icon' src={OneIcon} alt="Infographics Icon" />
            <h3>Lorem ipsum dolor</h3>
            <p>Duis aute irure dolor in reprehenderit in voluptate velitesse cillum dolore eu fugiat.</p>
          </div>
          <div className='feature'>
            <img className='number-icon' src={OneIcon} alt="Infographics Icon" />
            <h3>Lorem ipsum dolor</h3>
            <p>Duis aute irure dolor in reprehenderit in voluptate velitesse cillum dolore eu fugiat.</p>
          </div>
          <div className='feature'>
            <img className='number-icon' src={OneIcon} alt="Infographics Icon" />
            <h3>Lorem ipsum dolor</h3>
            <p>Duis aute irure dolor in reprehenderit in voluptate velitesse cillum dolore eu fugiat.</p>
          </div>
        </div>
    </div>

    <div className="faqs-container">
      <h2 className='section-header'>FAQs</h2>
      {[1, 2, 3].map((itemIndex) => (
        <div className={`faq ${expandedIndex === itemIndex ? 'expanded' : ''}`} key={`faq-${itemIndex}`}>
          <h3
            className="question"
            onClick={() => toggleAccordion(itemIndex)}
            aria-expanded={expandedIndex === itemIndex ? 'true' : 'false'}
          >
            {itemIndex === expandedIndex ? '▼ ' : '► '} 
            What is Lorem Ipsum? {itemIndex}
          </h3>
          {expandedIndex === itemIndex && (
            <p className="answer">
              {itemIndex === 1
                ? 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
                : itemIndex === 2
                ? 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
                : 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'}
            </p>
            
          )}
          <hr className='faq-divider' />
        </div>
        
      ))}
    </div>
    


    <div className='container end-container'>
      <h2>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h2>
      <h5 className='under-catchphrase'>Duis aute irure dolor in reprehenderit 
        in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</h5>
      <Link to="/signin" className='catchphrase-btn'>Try it</Link>
      <p className='bottom-link-p'>Made by <Link to="/team" className='underlined-link'>XYZ team</Link></p>
    </div>

    </>
  )
}

export default Main