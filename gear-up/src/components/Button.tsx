export default function Button({ children }: { children: React.ReactNode }) {
    return (
        <button type="submit" className="w-[30rem] main-color-gradient py-3 rounded-md font-medium text-xl text-white mb-4">{children}</button>
    )
}