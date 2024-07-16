const Card: React.FC<{ style?: string; children: React.ReactNode }> = ({
  style = "",
  children,
}) => {
  return (
    <div
      className={`${style} rounded-md bg-white bg-opacity-50 p-10 px-10 shadow-xl drop-shadow-lg backdrop-blur-md`}
    >
      {children}
    </div>
  );
};

export default Card;
