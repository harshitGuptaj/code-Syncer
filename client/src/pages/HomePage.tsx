import illustration from "@/assets/illustration.svg"
import floatingCode from "@/assets/floating-code.svg"
import FormComponent from "@/components/forms/FormComponent"
import BackgroundAnimation from "@/components/BackgroundAnimation"

function HomePage() {
    return (
        <div className="relative flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] p-4">
            <BackgroundAnimation />
            <img
                src={floatingCode}
                alt="Floating Code"
                className="absolute top-20 right-10 w-16 animate-pulse opacity-40 sm:top-32 sm:right-20 sm:w-24"
            />
            <img
                src={floatingCode}
                alt="Floating Code 2"
                className="absolute bottom-32 left-10 w-12 animate-pulse opacity-30 sm:bottom-40 sm:left-20 sm:w-20"
            />
            <div className="z-10 flex w-full max-w-6xl flex-col items-center justify-center gap-8 rounded-2xl bg-gradient-to-br from-[#1a1a2e]/95 to-[#16213e]/95 p-8 shadow-2xl border border-[#e94560]/30 sm:flex-row sm:gap-12 sm:p-12">
                <div className="flex w-full animate-up-down justify-center sm:w-1/2">
                    <img
                        src={illustration}
                        alt="Code Sync Illustration"
                        className="mx-auto w-[250px] sm:w-[400px]"
                    />
                </div>
                <div className="flex w-full items-center justify-center sm:w-1/2">
                    <FormComponent />
                </div>
            </div>
        </div>
    )
}

export default HomePage
