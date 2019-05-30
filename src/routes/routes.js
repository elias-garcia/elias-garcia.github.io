import About from "./About/About";
import Contact from "./Contact/Contact";
import Home from "./Home/Home";
import Work from "./Work/Work";

const leftRoutes = [
  {
    label: 'Home',
    path: '/',
    exact: true,
    component: Home
  },
  {
    label: 'About',
    path: '/about',
    component: About
  }
];
const rightRoutes = [
  {
    label: 'Work',
    path: '/work',
    component: Work
  },
  {
    label: 'Contact',
    path: '/contact',
    component: Contact
  }
]

export { leftRoutes, rightRoutes };

