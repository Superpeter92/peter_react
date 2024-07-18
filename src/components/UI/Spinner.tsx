import React from "react";
import { useSpring, animated, config, useTransition } from "@react-spring/web";

interface SpinnerProps {
  size?: number;
  color?: string;
  thickness?: number;
  isLoading: boolean;
  minDuration?: number;
}

const Spinner: React.FC<SpinnerProps> = ({
  size = 40,
  color = "#4B5563",
  thickness = 4,
  isLoading,
  minDuration = 1000,
}) => {
  const spinAnimation = useSpring({
    loop: true,
    to: { rotateZ: 360 },
    from: { rotateZ: 0 },
    config: { duration: 1000 },
  });

  const transitions = useTransition(isLoading, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0, delay: minDuration },
    config: config.molasses,
  });

  return (
    <>
      {transitions((style, item) => 
        item && (
          <animated.div style={style} className="flex items-center justify-center">
            <animated.div
              style={{
                width: size,
                height: size,
                borderRadius: "50%",
                border: `${thickness}px solid ${color}`,
                borderTopColor: "transparent",
                ...spinAnimation,
              }}
            />
          </animated.div>
        )
      )}
    </>
  );
};

export default Spinner;