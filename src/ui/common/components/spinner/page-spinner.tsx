import { AiOutlineLoading3Quarters } from "react-icons/ai"

const PageSpinner = ({ className, size = 30 }: { className?: string, size?: number }) => {
    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <AiOutlineLoading3Quarters className={`animate-spin ${className}`} size={size} />
        </div>
    )
}

export default PageSpinner