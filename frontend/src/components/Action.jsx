import React, { useState } from 'react';
import calendarImage from "../assets/calendar-hero.png";
import {ChevronDown, ChevronRight} from "lucide-react";
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';

const Action = () => {
    const actionData = {
        title: "[PROJECTNAME] in Action",
        description: "With [PROJECTNAME], you have everything you need to keep life organized.",
        sections: [
          {
            title: "Unified Calendars, Simplified Lives",
            text: "Effortlessly schedule and collaborate with shared calendars. Optimize your time and productivity with our unified platform.",
            imageSrc: calendarImage
          },
          {
            title: "Seamless Scheduling",
            text: "Effortlessly coordinate and schedule team meetings and personal appointments, ensuring that everyone's availability is taken into account.",
            imageSrc: calendarImage
          },
          {
            title: "Real-Time Updates",
            text: "Receive instant updates and notifications about changes in schedules, helping you stay on top of your commitments and avoid conflicts.",
            imageSrc: calendarImage
          },
          {
            title: "Enhanced Productivity",
            text: "Improve productivity by having a clear and organized overview of your work and personal life, helping you manage your time more effectively.",
            imageSrc: calendarImage
          },
          {
            title: "Collaborative Planning",
            text: "Collaborate with your team to plan projects and meetings, ensuring everyone is on the same page and working towards common goals.",
            imageSrc: calendarImage
          }
        ]};

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
          id="action"
          className="relative mb-10 pb-15 mt-15 lg:py-10 xl:py-15 lg:py-20 xl:py-30 overflow-hidden"
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
    
    export default Action;