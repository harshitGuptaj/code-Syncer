import { useAppContext } from "@/context/AppContext"
import { ACTIVITY_STATE } from "@/types/app"
import useResponsive from "@/hooks/useResponsive"
import { TbPaint, TbCode } from "react-icons/tb"

function DrawingView() {
    const { viewHeight } = useResponsive()
    const { setActivityState } = useAppContext()

    return (
        <div
            className="flex max-h-full min-h-[400px] w-full flex-col gap-2 p-4"
            style={{ height: viewHeight }}
        >
            <h1 className="view-title">Drawing</h1>
            <div className="flex flex-col items-center justify-center gap-4 h-full">
                <TbPaint size={64} className="text-primary" />
                <p className="text-center text-gray-400">
                    Click the Drawing icon in the sidebar to open the collaborative whiteboard.
                </p>
                <button
                    onClick={() => setActivityState(ACTIVITY_STATE.DRAWING)}
                    className="rounded-md bg-primary px-6 py-2 font-bold text-black hover:bg-green-400"
                >
                    Open Drawing
                </button>
                <button
                    onClick={() => setActivityState(ACTIVITY_STATE.CODING)}
                    className="flex items-center gap-2 rounded-md bg-darkHover px-6 py-2 text-white hover:bg-gray-700"
                >
                    <TbCode size={18} />
                    Back to Code
                </button>
            </div>
        </div>
    )
}

export default DrawingView
