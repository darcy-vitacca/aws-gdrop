//Core
import React, {  useEffect } from "react";

function ComingSoon() {
  useEffect(() => {
    window.scrollTo(0, 0);
  });

  return (
    <div className="containerBody">
      <h1 className="comingSoonText">Coming Soon...</h1>
    </div>
  );
}

export default ComingSoon;
