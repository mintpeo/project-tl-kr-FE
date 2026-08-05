import React, {useState} from 'react';
import './Home.css';

// import Pages
import Header from "./header/Header.jsx";
import Hero from "./hero/Hero.jsx";
import Features from "./features/Features.jsx";
import HowIw from "./howiw/HowIW.jsx";
import CTA from "./cta/CTA.jsx";
import Footer from "./footer/Footer.jsx";

const Home = () => {
    return (
        <>
            {/* Header */}
            <Header />
            {/* Hero */}
            <Hero />
            {/* Features */}
            <Features />
            {/* How It Word */}
            <HowIw />
            {/* CTA */}
            <CTA />
            {/* Footer */}
            <Footer />
        </>
    );
};

export default Home;