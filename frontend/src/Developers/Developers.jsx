import React from "react";
import { useNavigate } from "react-router-dom";
import Styles from './developers.module.css';
import Back from '../assets/back.webp';
import Barsime from '../assets/barsime.jpg';
import Christian from '../assets/christian.jpg';
import Bonette from '../assets/bonette.jpg';

import Instagram from '../assets/instagram.jpg';
import Github from '../assets/github.jpg';
import CN from '../assets/cn.jpg';
import Email from '../assets/email.jpg';
import Linkedin from '../assets/linkedin.jpg';
import Facebook from '../assets/facebook.jpg'; 

export default function Developers() {
    const cardsData = [
        {
            id: 1,
            name: "Alain Barsime",
            role: "Backend and Frontend",
            image: Barsime,
            email: "alainbarsime@gmail.com",
            github: "https://github.com/Alain-Barsime",
            linkedin: "https://www.linkedin.com/in/alainbarsime",
            instagram: "https://www.instagram.com/a.l.a.i.n__001/",
            facebook: "https://www.facebook.com/alain.barsime", // Corrected to a valid Facebook URL
            cn: "https://x.com/alain_Barsime"
        },
        {
            id: 2,
            name: "Christian Nshuti",
            role: "Backend",
            image: Christian,
            email: "chrisnshuti943@gmail.com", // Corrected to email address
            github: "https://github.com/ChristianNshuti",
            linkedin: "https://www.linkedin.com/in/nshuti-christian-a1b22032b",
            instagram: "https://www.instagram.com/mulindwa_christian",
            facebook: "https://www.facebook.com/profile.php?id=100095239536896",
            cn: "https://www.thecn.com/NC1088" // Moved to correct field
        },
        {
            id: 3,
            name: "Bonette Umurerwa",
            role: "UI/UX Design",
            image: Bonette,
            email: "bonnieumurerwa@gmail.com",
            github: "https://github.com/bonnette2", // Removed invalid colon
            linkedin: "https://www.linkedin.com/in/umurerwa-bonette-936a05330",
            instagram: "https://www.instagram.com/b.o.n.ni.e_/",
            facebook: "", // Left empty
            cn: "https://www.thecn.com/UB144" // Corrected typo
        },
    ];

    const navigate = useNavigate();

    return (
        <div className={Styles.container}>
            <div className={Styles.header}>
                <button
                    className={Styles.backButton}
                    aria-label="Go back to contacts page"
                    onClick={() => navigate('/contacts')}>
                    <img src={Back} alt="Back button" />
                </button>
                <div className={Styles.creatorsHeading}>
                    <p>Meet the Developers</p>
                    <div className={Styles.timeline}>
                        <span className={Styles.lineLeft}></span>
                        <span className={Styles.text}>2024-2025</span>
                        <span className={Styles.lineRight}></span>
                    </div>
                </div>
            </div>

            <div className={Styles.cardsContainer}>
                {cardsData.map((card) => (
                    <div key={card.id} className={Styles.card}>
                        <img src={card.image} alt={`${card.name}'s profile`} className={Styles.cardImage} />
                        <div className={Styles.details}>
                            <p className={Styles.cardName}>{card.name}</p>
                            <p className={Styles.cardRole}>{card.role}</p>
                            <div className={Styles.socialMedias}>
                                {card.instagram && (
                                    <a href={card.instagram} target="_blank" rel="noopener noreferrer" aria-label={`${card.name}'s Instagram`}>
                                        <img src={Instagram} alt="Instagram" className={Styles.socialIcon} />
                                    </a>
                                )}
                                {card.github && (
                                    <a href={card.github} target="_blank" rel="noopener noreferrer" aria-label={`${card.name}'s GitHub`}>
                                        <img src={Github} alt="GitHub" className={Styles.socialIcon} />
                                    </a>
                                )}
                                {card.linkedin && (
                                    <a href={card.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${card.name}'s LinkedIn`}>
                                        <img src={Linkedin} alt="LinkedIn" className={Styles.socialIcon} />
                                    </a>
                                )}
                                {card.cn && (
                                    <a href={card.cn} target="_blank" rel="noopener noreferrer" aria-label={`${card.name}'s Course Network`}>
                                        <img src={CN} alt="Course Network" className={Styles.socialIcon} />
                                    </a>
                                )}
                                {card.facebook && (
                                    <a href={card.facebook} target="_blank" rel="noopener noreferrer" aria-label={`${card.name}'s Facebook`}>
                                        <img src={Facebook} alt="Facebook" className={Styles.socialIcon} />
                                    </a>
                                )}
                                {card.email && (
                                    <a href={`mailto:${card.email}`} target="_blank" rel="noopener noreferrer" aria-label={`Email ${card.name}`}>
                                        <img src={Email} alt="Email" className={Styles.socialIcon} />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}