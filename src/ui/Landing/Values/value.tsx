interface ValueProps {
    title: string;
    description: string;
    Icon: React.ElementType;
  }
  
  const Value: React.FC<ValueProps> = ({ title, description, Icon }) => {
    return (
      <div className="flex flex-1 flex-col gap-2 md:gap-3 items-center text-center w-full md:max-w-sm">
        <Icon className="text-xl md:text-2xl" />
        <h4 className="text-sm font-semibold uppercase">{title}</h4>
        <p className="text-sm md:text-md font-light">{description}</p>
      </div>
    );
  };
  
  export default Value;
  