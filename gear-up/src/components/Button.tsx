export default function Button({ type }: { type: 'register' | 'login' }) {
    return (
        <button className="w-full main-color-gradient py-3 font-medium text-[16px]">{type.substring(0, 1).toUpperCase() + type.substring(1, type.length)}</button>
    )
}