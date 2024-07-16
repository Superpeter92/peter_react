import React from "react";
import { useSpring, animated } from "@react-spring/web";

type ClickHandler =
  | (() => void | Promise<void>)
  | ((e: React.FormEvent) => void | Promise<void>);

interface AnimatedButtonProps {
  onClick: ClickHandler;
  children?: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  iconOnly?: boolean;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  onClick,
  children,
  className = "",
  icon,
  iconPosition = "left",
  iconOnly = false,
}) => {
  const { x } = useSpring({
    from: { x: 0 },
    to: { x: 1 },
    config: { duration: 1000 },
  });
  const baseClassName = `
  relative inline-flex items-center justify-center 
  rounded-lg focus:outline-none focus:ring-2 
  focus:ring-blue-500 focus:ring-opacity-75
`;
  const sizeClassName = iconOnly
    ? "h-10 w-10" //
    : "h-10 px-4 py-2";

  const contentClassName = iconOnly
    ? "flex items-center justify-center"
    : "font-semibold";
  return (
    <animated.button
      onClick={onClick}
      style={{
        opacity: x.to({ range: [0, 1], output: [0.3, 1] }),
        scale: x.to({
          range: [0, 0.25, 0.35, 0.45, 0.55, 0.65, 0.75, 1],
          output: [1, 0.97, 0.9, 1.1, 0.9, 1.1, 1.03, 1],
        }),
      }}
      className={`${baseClassName} ${sizeClassName} ${contentClassName} ${className}`}
    >
      {!iconOnly && iconPosition === "left" && icon && (
        <span className="mr-2">{icon}</span>
      )}
      {!iconOnly && children}
      {!iconOnly && iconPosition === "right" && icon && (
        <span className="ml-2">{icon}</span>
      )}
      {iconOnly && icon}
    </animated.button>
  );
};

export default AnimatedButton;
