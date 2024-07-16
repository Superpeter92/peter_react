import React, { Suspense } from 'react';
import { animated, useSpring } from '@react-spring/web';
import { IconLoader2 } from '@tabler/icons-react';

const Loader: React.FC = () => {
    const { rotate } = useSpring({
        from: { rotate: 0 },
        to: { rotate: 1 },
        loop: { reverse: true },
        config: { duration: 1000 }
    })
  
 return( <div className="flex h-screen flex-col items-center justify-center">
    <animated.div
          style={{
            position: "absolute",
            left: "50%",
            transform: rotate.to((r) => `translateX(-50%) rotate(${r}deg)`),
          }}
        >
          <IconLoader2 stroke={2} className='h-10 w-10 text-purplue' />
        </animated.div>
        </div>)
}

interface AnimatedSuspenseProps {
  children: React.ReactNode;
}

const AnimatedSuspense: React.FC<AnimatedSuspenseProps> = ({ children }) => {

  

 return (
      <Suspense  fallback={<Loader />}>{children}</Suspense>
  )
};

export default AnimatedSuspense;