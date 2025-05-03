import { AiOutlineLoading3Quarters } from "react-icons/ai"

const PageSpinner = ({ className, size }: { className?: string, size?: number }) => {
    return (
        <div className="flex items-center justify-center min-h-[90vh]">
            <AiOutlineLoading3Quarters className={`animate-spin ${className}`} size={size} />
        </div>
    )
}

export default PageSpinner