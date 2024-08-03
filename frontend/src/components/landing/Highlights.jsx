import { useInView } from 'react-intersection-observer';
import { useEffect, useState } from "react";
import { motion } from 'framer-motion';
import Tagline from "../reusable/TagLine";
import Typing from 'react-typing-effect';

import services1 from "../../assets/png/services_1.png";
import services2 from "../../assets/png/services_2.png";
import services3 from "../../assets/png/services_3.png";
import { CircleCheck } from "lucide-react";

const Services = () => {
    // Use the useInView hook to track the visibility of the component
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
    const [hasTyped, setHasTyped] = useState(false);

    // Use effect to set hasTyped state when the component comes into view
    useEffect(() => {
        if (inView && !hasTyped) {
            setHasTyped(true);
        }
    }, [inView, hasTyped]);

    // List of services to be displayed in the first card
    const services = [
        "See schedules of people in your calendar",
        "Find a common time for meetings",
        "Add and edit your shared schedules",
    ];

    // Animation variants for framer-motion
    const variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

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
        <div id="highlights" className="relative py-15 mt-[5em] lg:py-2 xl:py-10 lg:py-25 xl:py-30 overflow-hidden">
            <div className="container">
                {/* Header */}
                <div ref={ref} className="md:max-w-md lg:max-w-2xl max-w-[50rem] mx-auto mb-12 lg:mb-20 md:text-center">
                <motion.div
                    ref={ref}
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                    variants={slideUpEffect}
                >
                    <Tagline className="mb-4 md:justify-center">What we're working on</Tagline>
                    {inView && (
                        <Typing
                            text={["Plan Smarter, Not Harder with TimeMesh"]}
                            className="h2"
                            speed={100}
                            eraseSpeed={50}
                            typingDelay={290}
                            cursor=""
                            eraseDelay={1000000} // Large value to prevent erasing and retyping
                        />
                    )}
                </motion.div>
                </div>

                {/* Main content with motion effects */}
                <motion.div
                    className="relative"
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                    variants={variants}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    ref={ref}
                >
                    {/* First card component */}
                    <motion.div
                        className="relative z-1 flex flex-col sm:flex-row h-auto sm:h-[35rem] mb-5 border border-green-700 rounded-3xl overflow-hidden"
                        initial="hidden"
                        animate={inView ? "visible" : "hidden"}
                        variants={variants}
                        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                    >
                        {/* Image section */}
                        <div className="w-full sm:w-3/5 h-64 sm:h-full">
                            <img
                                className="w-full h-full object-cover rounded-t-3xl sm:rounded-l-3xl sm:rounded-t-none"
                                alt="Smartest AI"
                                src={services1}
                            />
                        </div>

                        {/* Text content section */}
                        <div className="relative z-1 w-full sm:w-2/5 p-8 bg-white rounded-b-3xl sm:rounded-r-3xl sm:rounded-b-none">
                            <h4 className="h4 my-5">Quick planning</h4>
                            <p className="body-2 mb-[3rem] text-n-4">
                                Import your your friends and workmates calendart to be ahead everywhere
                            </p>
                            <ul className="body-2">
                                {services.map((item, index) => (
                                    <li
                                        key={index}
                                        className="flex items-start py-4 border-t border-green-700"
                                    >
                                        <CircleCheck stroke="#15803d" width={24} height={24} alt="check" />
                                        <p className="ml-4">{item}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>

                    {/* Second and third card component */}
                    <div className="relative z-1 grid gap-5 lg:grid-cols-2">
                        {/* Second card */}
                        <motion.div
                            className="relative min-h-[30rem] border border-green-700 rounded-3xl overflow-hidden bg-white"
                            initial="hidden"
                            animate={inView ? "visible" : "hidden"}
                            variants={variants}
                            transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
                        >
                            {/* Image section */}
                            <div className="h-64 sm:h-72 md:h-80 lg:h-96 w-full overflow-hidden rounded-t-3xl">
                                <img
                                    src={services2}
                                    className="h-full w-full object-cover"
                                    width={630}
                                    height={750}
                                    alt="robot"
                                />
                            </div>

                            {/* Text content section */}
                            <div className="p-8 lg:p-15">
                                <h4 className="h4 mb-4">Stay in touch with everyone</h4>
                                <p className="body-2 mb-[3rem] text-n-4">
                                    TimeMesh Calendar is a platform where anyone can easily share event information in calendar format.
                                    Share important information you don't want others to miss!
                                </p>
                            </div>
                        </motion.div>

                        {/* Third card */}
                        <motion.div
                            className="p-4 bg-white border border-green-700 rounded-3xl overflow-hidden lg:min-h-[30rem]"
                            initial="hidden"
                            animate={inView ? "visible" : "hidden"}
                            variants={variants}
                            transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}
                        >
                            {/* Text content section */}
                            <div className="py-12 px-4 xl:px-8">
                                <h4 className="h4 mb-4">Infinite ways to use TimeMesh</h4>
                                <p className="body-2 mb-[2rem] text-n-4">
                                    Find the perfect way to use the calendar for you!
                                </p>
                            </div>

                            {/* Image section */}
                            <div className="relative h-[20rem] bg-n-8 rounded-xl overflow-hidden md:h-[25rem]">
                                <img
                                    src={services3}
                                    className="w-full h-full object-cover"
                                    width={520}
                                    height={400}
                                    alt="Scary robot"
                                />
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Services;
