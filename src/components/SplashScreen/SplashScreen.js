import React from 'react'
import './splashscreen.css'

export const SplashScreen = () => {
    return (
        <div className="pagina">
            <img
            classname="centro"
            src={require('../../assets/PU_Logo.png')}
            />
            <p>Cargando ...</p>
        </div>
    )
}
