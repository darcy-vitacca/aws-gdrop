import React, { Componen, useEffect } from 'react'

function Beta() {
    useEffect(() => {
        window.scrollTo(0, 0);
      });
    
      return (
        <div className="containerBody">
          <h1 className="betaText">Congratulations, you're an early adopter! You've signed up for G'drop BETA. We will reach out to you when it's ready. Have a great day!</h1>
        </div>
      );
}

export default Beta
