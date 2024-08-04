import { Arrow } from "../../assets/svg";
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { TagLine }from '../reusable';
import Typing from 'react-typing-effect';
import {benefits} from "../../constants/index"; // import text contents from constants/index.js
/**
 * Benefits component that showcases key features and benefits with interactive elements.
 * 
 * This component includes:
 * - A header section with a title.
 * - A grid layout displaying various benefit items.
 * - Each benefit item features a tagline, title, description, and icon.
 * - A "Join waitlist" link that is animated on hover.
 * 
 * @component
 * @returns {JSX.Element} The rendered Benefits component.
 */
const Benefits = () => {

    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

    const slideUpEffect = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                delay: 0.2,
                duration: 0.6,
                ease: 'easeInOut',
            },
        },
    };

    return (
        <div id="features" className="relative py-15 lg:py-16 xl:py-20 lg:py-32 xl:py-40 overflow-hidden">
            <div className="container relative z-2">
                {/* Header */}
                <div className="md:max-w-md lg:max-w-2xl max-w-[50rem] mx-auto mb-12 lg:mb-20 md:text-center">
                    <h2 className="h2">Good live with great schedules</h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-10">
                    {benefits.map((item) => (
                        <motion.div
                            key={item.id}
                            initial="hidden"
                            animate={inView ? "visible" : "hidden"}
                            variants={slideUpEffect}
                            className="relative p-0.25 rounded-[2.5rem] bg-green-700 hover:bg-conic-gradient group"
                        >
                            <div className="relative bg-n-1 rounded-[2.4375rem] overflow-hidden h-full flex flex-col">
                                <div className="relative z-2 flex flex-col h-full p-[2.4rem] bg-white rounded-2xl">
                                    <TagLine className="mb-3">{item.tagline}</TagLine>
                                    <h5 className="h5 mb-5">{item.title}</h5>
                                    <p className="body-2 mb-6 text-n-9 flex-grow">{item.text}</p>
                            
                                    <div className="flex items-center mt-auto">
                                        {<item.iconUrl stroke="#15803d" />}
                                        <a
                                            href="#hero"
                                            className="ml-auto z-20 font-code text-xs font-bold text-green-700 uppercase tracking-wider flex items-center group"
                                        >
                                            Join waitlist
                                            <span className="transition-transform transform group-hover:translate-x-1 ml-1">
                                                <Arrow />
                                            </span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>


            </div>
        </div>
    );
};

export default Benefits;

