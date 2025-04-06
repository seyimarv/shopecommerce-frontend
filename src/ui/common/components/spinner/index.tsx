import { AiOutlineLoading3Quarters } from "react-icons/ai"

const Spinner = ({className, size}: {className?: string, size?: number}) => {
    return (
       <AiOutlineLoading3Quarters className={`animate-spin ${className}`} size={size} />
    )
}

export default Spinner