import {CalendarCheck, BellPlus, ListChecks, UserRoundPlus, Calendar as CalendarIcon} from 'lucide-react';
// import png for Features
import {ConceptCalAddEvent, ConceptCalEventDetails, ConceptCalFriendsDetails, ConceptCalUpdates} from "../assets/png";

import {CalendarUser} from "../assets/svg";

/**
 * List of item text that is displayed on the benefits cards
 */
const benefits = [
  {
    id: "0",
    tagline: "Seamless Scheduling",
    title: "All-in-One Scheduling",
    text: "Effortlessly coordinate and schedule team meetings and personal appointments, ensuring that everyone's availability is taken into account.",
    iconUrl: CalendarCheck,
    imageUrl: "#",
  },
  {
    id: "1",
    tagline: "Real-Time Updates",
    title: "Effortless Coordination",
    text: "Receive instant updates and notifications about changes in schedules, helping you stay on top of your commitments and avoid conflicts.",
    iconUrl: BellPlus,
    imageUrl: "#",
    light: true,
  },
  {
    id: "2",
    tagline: "Enhanced Productivity",
    title: "Never Miss a Beat",
    text: "Improve productivity by having a clear and organized overview of your work and personal life, helping you manage your time more effectively.",
    iconUrl: ListChecks,
    imageUrl: "#",
  }
];

/**
 * List if items for features cards features section
 */
const actionData = {
  title: "TimeMesh in Action",
  description: "With TimeMesh, you have everything you need to keep life organized.",
  sections: [
    {
      title: "Unified Calendars, Simplified Lives",
      text: "Effortlessly schedule and collaborate with shared calendars. Optimize your time and productivity with our unified platform.",
      imageSrc: ConceptCalAddEvent
    },
    {
      title: "Seamless Scheduling",
      text: "Effortlessly coordinate and schedule team meetings and personal appointments, ensuring that everyone's availability is taken into account.",
      imageSrc: ConceptCalEventDetails
    },
    {
      title: "Collaborative Planning",
      text: "Collaborate with your team to plan projects and meetings, ensuring everyone is on the same page and working towards common goals.",
      imageSrc: ConceptCalFriendsDetails
    },
    {
      title: "Real-Time Updates",
      text: "Receive instant updates and notifications about changes in schedules, helping you stay on top of your commitments and avoid conflicts.",
      imageSrc: ConceptCalUpdates
    }
]};

/**
 * List if items for features cards features section, first card
 */
const services = [
  "See schedules of people in your calendar",
  "Find a common time for meetings",
  "Add and edit your shared schedules",
];

/**
 * List of item-links that will be displayed in the navigation bar of the landing page.
 */
const navigation = [
  {
    id: "0",
    title: "Home",
    url: "#hero",
  },
  {
    id: "1",
    title: "Highlights",
    url: "#highlights",
  },
  {
    id: "2",
    title: "Features",
    url: "#features",
  },
  {
    id: "3",
    title: "Sign in",
    url: "/signin",
    onlyMobile: true,
  },
];

const sideBarAccordians = [
  {
    title: "Calendar",
    iconUrl: CalendarIcon, // Icon component
    iconType: 'component'
  },
  {
    title: "Shared Calendar",
    iconUrl: CalendarUser, // Icon component
    iconType: 'component'
  }
];


export { benefits, actionData, services, navigation, sideBarAccordians }; 