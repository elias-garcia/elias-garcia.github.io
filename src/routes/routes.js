import About from "./About/About";
import Home from "./Home/Home";

const leftRoutes = [
  {
    label: 'Home',
    path: '/',
    exact: true,
    component: Home
  }
];
const rightRoutes = [
  {
    label: 'About',
    path: '/about',
    exact: true,
    component: About
  }
]

export { leftRoutes, rightRoutes };

