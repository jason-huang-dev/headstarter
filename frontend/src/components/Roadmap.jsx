import { useInView } from 'react-intersection-observer';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Tagline from "./Tagline";
import { Check, Loader } from "lucide-react";
import grid from "../assets/grid.png";
import Typing from 'react-typing-effect';

const roadmap = [
  {
    id: "0",
    title: "Data base work",
    text: "Optimize the database structure and queries to improve the calendar's performance and scalability.",
    date: "August 2024",
    status: "progress",
  },
  {
    id: "1",
    title: "Cloud integration",
    text: "Integrate the calendar with cloud storage services, such as Google Drive or Dropbox, to allow users to sync their events across devices.",
    date: "August 2024",
    status: "progress",
  },
  {
    id: "2",
    title: "Dashboard integration",
    text: "Build a dashboard that allows users to view and manage their events in a more visual and intuitive way.",
    date: "August 2024",
    status: "progress",
  },
  {
    id: "3",
    title: "Integration with APIs",
    text: "Allow users to connect their calendar with other apps and services through APIs, such as social media platforms or task management tools.",
    date: "August 2024",
    status: "progress",
  },
];

const Roadmap = () => {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });


  return (
    <div id="roadmap" className="relative pb-15 mt-0 lg:py-16 xl:py-20 lg:py-32 xl:py-30 overflow-hidden" ref={ref}>
      <div className="container md:pb-10">
        {/* Header */}
        <div className="md:max-w-md lg:max-w-2xl max-w-[50rem] mx-auto mb-12 lg:mb-20 md:text-center">
          <Tagline className="mb-4 md:justify-center">What we're working on</Tagline>
        
          <motion.div
                    ref={ref}
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                >
                    {inView && (
                        <Typing
                            text={["Developers' Jorney"]}
                            className="h2"
                            speed={100}
                            eraseSpeed={50}
                            typingDelay={290}
                            cursor=""
                            eraseDelay={100000} // Large value to prevent erasing and retyping
                        />
                    )}
                </motion.div>
       
        </div>

        <div className="relative grid gap-6 md:grid-cols-2 md:gap-4 md:pb-[7rem]">
        {roadmap.map((item) => {
          const status = item.status === "done" ? "Done" : "In progress";
                return (
                    <div
                      className="md:flex even:md:translate-y-[7rem] p-0.25 rounded-[2.5rem] bg-green-700 hover:bg-conic-gradient group"
                      key={item.id}
                    >
                      <div className="relative p-8 bg-n-1 rounded-[2.4375rem] overflow-hidden xl:p-15">
                        <div className="absolute top-0 left-0 max-w-full opacity-30">
                          <img
                            className="w-full h-full object-cover"
                            src={grid}
                            alt="Grid"
                          />
                        </div>
                        <div className="relative z-1">
                          <div className="flex items-center justify-between max-w-[27rem] mb-8 md:mb-20">
                            <Tagline>{item.date}</Tagline>
        
                            <div className="flex items-center px-2 py-1 bg-green-700 rounded text-n-1">
                              {item.status === "done" ? (
                                <Check className="mr-2.5" width={16} height={16} />
                              ) : (
                                <Loader className="mr-2.5" width={16} height={16} />
                              )}
                              <div className="tagline">{status}</div>
                            </div>
                          </div>
        
                          <h4 className="h4 mb-4">{item.title}</h4>
                          <p className="body-2 text-n-4">{item.text}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
            };
        export default Roadmap;