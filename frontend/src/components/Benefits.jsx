import Arrow from "../assets/svg/Arrow";
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import Typing from 'react-typing-effect';
import {CalendarCheck, BellPlus, ListChecks, Users, Earth} from "lucide-react";

const Benefits = () => {
    const benefits = [
        {
          id: "0",
          title: "Seamless Scheduling",
          text: "Effortlessly coordinate and schedule team meetings and personal appointments, ensuring that everyone's availability is taken into account.",
          backgroundUrl: "assets/benefits/calendar-1.svg",
          iconUrl: CalendarCheck,
          imageUrl: "#",
        },
        {
          id: "1",
          title: "Real-Time Updates",
          text: "Receive instant updates and notifications about changes in schedules, helping you stay on top of your commitments and avoid conflicts.",
          backgroundUrl: "assets/benefits/calendar-2.svg",
          iconUrl: BellPlus,
          imageUrl: "#",
          light: true,
        },
        {
          id: "2",
          title: "Enhanced Productivity",
          text: "Improve productivity by having a clear and organized overview of your work and personal life, helping you manage your time more effectively.",
          backgroundUrl: "assets/benefits/calendar-3.svg",
          iconUrl: ListChecks,
          imageUrl: "#",
        },
        {
          id: "3",
          title: "Collaborative Planning",
          text: "Collaborate with your team to plan projects and meetings, ensuring everyone is on the same page and working towards common goals.",
          backgroundUrl: "assets/benefits/calendar-4.svg",
          iconUrl: Users,
          imageUrl: "#",
          light: true,
        },
        {
          id: "4",
          title: "Universal Access",
          text: "Access your calendar from any device, anywhere, ensuring you always have your schedule at your fingertips.",
          backgroundUrl: "assets/benefits/calendar-5.svg",
          iconUrl: Earth,
          imageUrl: "#",
        },
    
      ];

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
        <div id="features" className="relative py-15 mt-15 lg:py-16 xl:py-20 lg:py-32 xl:py-40 overflow-hidden">
            <div className="container relative z-2">
                <div ref={ref} className="md:max-w-md lg:max-w-2xl max-w-[50rem] mx-auto mb-12 lg:mb-20 md:text-center">
                <motion.div
                    ref={ref}
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                    variants={slideUpEffect}
                >
                    {inView && (
                        <Typing
                            text={["Plan Smarter, Not Harder with [Project Name]"]}
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

                <div className="flex flex-wrap justify-center gap-10 mb-10">
                    {benefits.map((item) => (
                        <motion.div
                            key={item.id}
                            initial="hidden"
                            animate={inView ? "visible" : "hidden"}
                            variants={slideUpEffect}
                            className="block relative p-0.5 bg-no-repeat bg-[length:100%_100%] md:max-w-[24rem] border border-green-700 rounded-2xl overflow-hidden"
                            style={{
                                backgroundImage: `url(${item.backgroundUrl})`,
                            }}
                        >
                            <div className="relative z-2 flex flex-col min-h-[22rem] p-[2.4rem] bg-white rounded-2xl">
                                <h5 className="h5 mb-5">{item.title}</h5>
                                <p className="body-2 mb-6 text-n-9">{item.text}</p>
                                <div className="flex items-center mt-auto">
                                    {<item.iconUrl stroke="#15803d" />}

                                    <a
                                        href="signin"
                                        className="ml-auto z-20 font-code text-xs font-bold text-green-700 uppercase tracking-wider flex items-center group"
                                    >
                                        Explore more
                                        <span className="transition-transform transform group-hover:translate-x-1 ml-1">
                                            <Arrow />
                                        </span>
                                    </a>
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
