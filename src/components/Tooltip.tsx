import { ReactNode } from "react";
export const Tooltip: React.FC<{
  children: ReactNode;
  tooltip: string;
  position: "left" | "right";
}> = ({ children, tooltip, position = "left" }) => {
  return (
    <div className="group relative inline-block">
      {children}
      <span
        className={`invisible absolute ${position === "left" ? "right-10" : "left-10"} z-50 mt-2 rounded p-1 text-sm text-gray-900 opacity-0 transition group-hover:visible group-hover:opacity-100`}
      >
        {tooltip}
      </span>
    </div>
  );
};
