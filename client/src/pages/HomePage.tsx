import illustration from "@/assets/illustration.svg"
import FormComponent from "@/components/forms/FormComponent"
// import Footer from "@/components/common/Footer";

function HomePage() {
    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-[#4ade80] to-[#22d3ee] p-4">
            <div className="flex w-full max-w-6xl flex-col items-center justify-center gap-8 rounded-2xl bg-[#2a2d35] p-8 shadow-2xl sm:flex-row sm:gap-12 sm:p-12">
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
