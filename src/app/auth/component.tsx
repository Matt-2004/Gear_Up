import { ReactNode } from "react"

export const AuthPageContainer = ({ children }: { children: ReactNode }) => {
	return (
		<div className="relative h-screen w-screen sm:mt-8">
			<div className="sm:bg-background h-full w-screen bg-white p-2 sm:flex sm:flex-col sm:items-center sm:bg-none md:bg-none">
				{children}
			</div>
		</div>
	)
}

export const AuthPageCaption = ({ children }: { children: ReactNode }) => {
	return (
		<div id="header" className="flex items-center justify-center">
			{/* Logo */}
			<h1 className="text-primary text-2xl sm:text-3xl md:text-4xl font-bold">
				{children}
			</h1>
		</div>
	)
}

export const FormContainer = ({ children }: { children: ReactNode }) => {
	return (
		<div className="relative flex w-full flex-col items-center justify-center gap-1 space-y-6 sm:space-y-10 rounded-lg bg-white py-8 sm:py-14 md:py-20 sm:w-[80%] md:w-[70%] md:shadow-sm lg:w-[60%]">
			{children}
		</div>
	)
}

export const AuthPageContent = ({ children }: { children: ReactNode }) => {
	return <p className="w-11/12 md:w-4/6">{children}</p>
}
