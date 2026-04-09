import React from 'react'
import Hero from './components/sections/Hero'
import ShowcaseSection from './components/sections/ShowcaseSection'
import Navbar from './components/Navbar'
import LogoSection from './components/sections/LogoSection'
import FeatureCards from './components/sections/FeatureCards'
import ExperienceSection from './components/sections/ExperienceSection'
import TechStack from './components/sections/TechStack'
import Contact from './components/sections/Contact'
import AskAboutMe from './components/sections/Askaboutme'


const App = () => {
  return (
    <>
    <Navbar/>
    <Hero />
    {/* <FeatureCards/> */}
    <TechStack/>
    <ShowcaseSection/>
    {/* <LogoSection/> */}
    {/* <ExperienceSection/> */}
    <AskAboutMe/>
    <Contact/>
    </>
  )
}

export default App