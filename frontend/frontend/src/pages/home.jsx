
import HeroSlider from '../components/heroSlider.jsx'
import CallToAction from './../components/callToAction.jsx';
import About from '../components/about.jsx'
import Stats from '../components/stats.jsx'
import Departments from '../components/departments.jsx'; 

function Home() {
  return (
    <div>
      <HeroSlider />
      <CallToAction />
      <About />
      <Stats />
      <Departments />
    </div>
  );
}

export default Home
