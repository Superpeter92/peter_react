import React, { useState, useRef } from "react";
import { useSpring, animated, config } from "@react-spring/web";
import { IconLoader2 } from "@tabler/icons-react";

type ClickHandler =
  | (() => void | Promise<void>)
  | ((e: React.FormEvent) => void | Promise<void>);

interface SpinnerButtonProps {
  onClick: ClickHandler;
  children: React.ReactNode;
  className?: string;
}

const SpinnerButton: React.FC<SpinnerButtonProps> = ({
  onClick,
  children,
  className = "",
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const clickEventRef = useRef<React.FormEvent | null>(null);
  const { x } = useSpring({
    from: { x: 0 },
    to: { x: 1 },
    config: { duration: 1000 },
  });
  const { rotate } = useSpring({
    from: { rotate: 0 },

    to: async (next) => {
      if (isLoading) {
        await next({ rotate: 360, config: { duration: 1000 } });
        await next({ rotate: 0, config: { duration: 0 } });
      }
    },
    reset: isLoading,
    loop: isLoading,
    config: config.slow,
  });



  const handleClick = async (e: React.FormEvent) => {
    if (isLoading) return;
    setIsLoading(true);
    clickEventRef.current = e;

    try {
      if (typeof onClick === "function" && clickEventRef.current) {
        await onClick(clickEventRef.current);
      }
    } finally {
      setIsLoading(false);
      clickEventRef.current = null;
    }
  };

  return (
    <animated.button
      onClick={handleClick}
      style={{
        opacity: x.to({ range: [0, 1], output: [0.3, 1] }),
        scale: x.to({
          range: [0, 0.25, 0.35, 0.45, 0.55, 0.65, 0.75, 1],
          output: [1, 0.97, 0.9, 1.1, 0.9, 1.1, 1.03, 1],
        }),
      }}
      disabled={isLoading}
      className={`relative inline-flex h-10 items-center justify-center rounded-lg bg-purplue px-4 py-2 font-semibold text-white shadow-md hover:bg-darkPurplue focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 ${className}`}
    >
      {isLoading ? (
        <animated.div
          style={{
            position: "absolute",
            left: "50%",
            transform: rotate.to((r) => `translateX(-50%) rotate(${r}deg)`),
          }}
        >
          <IconLoader2 stroke={2} />
        </animated.div>
      ) : (
        children
      )}
    </animated.button>
  );
};

export default SpinnerButton;
