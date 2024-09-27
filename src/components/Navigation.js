import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import './styles/Navigation.css';

const Navigation = () => {
    const location = useLocation();

    return (
        <div className="MyNavBar">
            <ul>
                {['/','/categories', '/content' ].map((path, index) => {
                    const isActive = location.pathname === path;
                    const textMap = {
                        '/': 'البحث',
                        '/content': 'المضمون',
                        '/categories': 'الموضوع'
                    };

                    return (
                        <li key={index}>
                            <NavLink to={path}>
                                {isActive && <span style={{ color: '#BB86FC' }}><img src="/hammer.svg" width="16px" height="16px" alt="Icon" />{' '}</span>}
                                <span style={{ color: isActive ? '#03DAC6' : 'inherit', fontWeight: isActive ? 'bold' : 'normal' }}>
                                    {textMap[path]}
                                </span>
                            </NavLink>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default Navigation;
