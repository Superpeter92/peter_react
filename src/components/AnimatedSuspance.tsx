import { animated, config, useSpring } from "@react-spring/web";
import { IconLoader2 } from "@tabler/icons-react";
import { Suspense } from "react";

const Loader: React.FC = () => {
  const { rotate } = useSpring({
    from: { rotate: 0 },
    to: { rotate: 360 },
    loop: true,
    config: { duration: 1000 },
  });

  const fadeIn = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { ...config.molasses, duration: 1000 },
  });

  return (
    <animated.div
      style={fadeIn}
      className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50"
    >
      <animated.div
        style={{
          transform: rotate.to((r) => `rotate(${r}deg)`),
        }}
      >
        <IconLoader2 stroke={2} className="h-10 w-10 text-purplue" />
      </animated.div>
    </animated.div>
  );
};

interface AnimatedSuspenseProps {
  children: React.ReactNode;
}

const AnimatedSuspense: React.FC<AnimatedSuspenseProps> = ({ children }) => {
  return <Suspense fallback={<Loader />}>{children}</Suspense>;
};

export default AnimatedSuspense;
