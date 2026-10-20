import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import FeaturedDestination from '../components/FeaturedDestination'
import Hero from '../components/Hero'
import ExclusiveOffers from '../components/ExclusiveOffers'
import About from '../components/About'
import Testimonials from '../components/Testimonials'
import Footer from '../components/Footer'

const Home = () => {
    const location = useLocation()

    useEffect(() => {
        if (location.hash) {
            const targetId = location.hash.replace('#', '')
            const timer = setTimeout(() => {
                const element = document.getElementById(targetId)
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' })
                }
            }, 100)
            return () => clearTimeout(timer)
        }
    }, [location])

    return (
        <>
            <Hero />
            <FeaturedDestination />
            <ExclusiveOffers />
            <About />
            <Testimonials />
            <Footer />
        </>
    )
}

export default Home