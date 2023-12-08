import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; // Import the CSS file for styling
import heroImg from "./countryPark.jpg";
import Hero from "./Hero";

function Home() {
    return (
        <section>
            <Hero
            cName="hero"
            heroImg={heroImg}
            title="Monitor harmful system"
            text="This website provides server data retrieval and management functions and has a monitor module to check for hazardous materials."
            buttonText="Start Model"
            url="/Monitor"
            btnClass="show"
            />
        </section>
    );
}

export default Home;
