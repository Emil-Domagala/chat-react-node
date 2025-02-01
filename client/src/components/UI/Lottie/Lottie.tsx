import { useEffect } from 'react';
import animationData from '../../../assets/lottie-json.json';

import Lottie from 'react-lottie';

function LottieComp({ size = 150 }: { size?: number }) {
  useEffect(() => {
    const imageElement = document.querySelector('#container-lottie-1 svg g g image');
    const colorMode = localStorage.getItem('color-mode');
    if (colorMode === 'light' && imageElement) {
      console.log('now');
      imageElement.remove();
    }
  }, []);

  const animationDEfaultOprions = { loop: true, autoplay: true, animationData: animationData };

  return (
    <div id="container-lottie-1" className="lottie-container">
      <Lottie isClickToPauseDisabled height={size} width={size} options={animationDEfaultOprions} />
    </div>
  );
}

export default LottieComp;
