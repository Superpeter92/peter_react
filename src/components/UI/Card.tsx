const Card: React.FC<{ className?: string; children: React.ReactNode }> = ({
  className = "",
  children,
}) => {
  return (
    <div
      className={`${className} rounded-md bg-white ring-1 ring-slate-400 bg-opacity-50 p-10  shadow-xl drop-shadow-lg backdrop-blur-md`}
    >
      {children}
    </div>
  );
};

export default Card;
