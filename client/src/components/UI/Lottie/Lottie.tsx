import animationData from '../../../assets/lottie-json.json';

import Lottie from 'react-lottie';

function LottieComp({ size = 150 }: { size?: number }) {
  const animationDEfaultOprions = { loop: true, autoplay: true, animationData: animationData };

  return (
    <div id="container-lottie-1" className="lottie-container">
      <Lottie isClickToPauseDisabled height={size} width={size} options={animationDEfaultOprions} />
    </div>
  );
}

export default LottieComp;
