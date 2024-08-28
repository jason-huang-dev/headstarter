import React, { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';

import {actionData} from "../../constants/index"; // import text contents from constants/index.js
import {ChevronDown, ChevronRight} from "lucide-react"; // import lucide icons

/**
 * Features component that displays various features of the TimeMesh platform with interactive sections.
 * 
 * This component includes:
 * - A title and description for the features section.
 * - Interactive sections for each feature that expand to show more details when clicked.
 * - An image associated with the currently selected feature displayed on the right.
 * 
 * @component
 * @returns {JSX.Element} The rendered Features component.
 */
const Features = () => {

      const [selectedSection, setSelectedSection] = useState(actionData.sections[0]);
      const [expandedSection, setExpandedSection] = useState(actionData.sections[0].title);
      const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

      
      const toggleSection = (section) => {
            if (expandedSection === section.title) return; 
            setSelectedSection(section);
            setExpandedSection(section.title);
        };
    
      return (
        <motion.div
          id="features"
          className="relative mb-20 pb-15 mt-15 xl:py-15 lg:py-20 xl:py-30 overflow-hidden"
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="container mx-auto">
            <div className="md:max-w-md lg:max-w-2xl max-w-[50rem] mx-auto mb-12 lg:mb-20 md:text-center">
              <h2 className="h2">{actionData.title}</h2>
              <p className="text-xl text-gray-600 mt-4">{actionData.description}</p>
            </div>
    
            <div className="border border-green-700 rounded-2xl p-8 lg:p-16">
              <div className="grid lg:grid-cols-3 gap-8 items-start">
                {/* Left Column */}
                <div className="lg:col-span-1 col-span-3 space-y-4">
                  {actionData.sections.map((section, index) => (
                    <div key={index} className="cursor-pointer" onClick={() => toggleSection(section)}>
                      <div className={`text-lg font-bold flex justify-between items-center p-4 rounded-lg ${expandedSection === section.title ? 'bg-gray-200' : ''}`}>
                        {section.title}
                        <span>{expandedSection === section.title ? <ChevronDown /> : <ChevronRight />}</span>
                      </div>
                      {expandedSection === section.title && (
                        <p className="text-gray-600 mt-2 ml-4">{section.text}</p>
                      )}
                    </div>
                  ))}
                </div>
    
                {/* Right Column */}
                <div className="lg:col-span-2 col-span-3 flex justify-center lg:justify-end">
                  <img
                    src={selectedSection.imageSrc}
                    alt={selectedSection.title}
                    className="w-full rounded-lg shadow-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      );
    };
    
    export default Features;