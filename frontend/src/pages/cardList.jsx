import React from 'react';
import '../css/cardList.css';
import MyCard from '../images/mycard.png';
import RandomImg from '../images/randomcard.png';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../images/LOGO.png';
import CommonNavigation from '../pages/main_navi';

function CardList() {
    const navigate = useNavigate();
    return (
        <CommonNavigation>
            <div className="card-container">
                <div className='MyCard'>
                    <Link to="./card">
                        <img src={MyCard} alt="card" className="MyCard" />
                    </Link>
                    <h2>내 카드</h2>
                </div>

                <div className='RandomCard'>
                    <Link to="./card">
                        <img src={RandomImg} alt="card" className="RandomCard" />
                    </Link>
                    <h2>랜덤 카드</h2>
                </div>
            </div>
        </CommonNavigation>
    );
}
export default CardList; 