interface ValueProps {
    title: string;
    description: string;
    Icon: React.ElementType;
  }
  
  const Value: React.FC<ValueProps> = ({ title, description, Icon }) => {
    return (
      <div className="flex flex-1 flex-col gap-3 items-center text-center max-w-sm">
        <Icon className="" />
        <h4 className="text-sm font-semibold uppercase">{title}</h4>
        <p className="text-md font-light">{description}</p>
      </div>
    );
  };
  
  export default Value;
  