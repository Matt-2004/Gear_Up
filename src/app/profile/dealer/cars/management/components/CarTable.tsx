"use client"

import { CarItems } from "@/types/car.types"
import { getStatusColor } from "../utils"
import { useState } from "react"
import { MoreHorizontal, Pencil, Trash2, Fuel, Settings, Calendar } from "lucide-react"
import Image from "next/image"

interface CarTableProps {
    cars: CarItems[]
    onDelete: (carId: string) => void
    onEdit: (carId: string) => void
}

export default function CarTable({ cars, onDelete, onEdit }: CarTableProps) {
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null)

    const toggleMenu = (id: string) => {
        setActiveMenuId(activeMenuId === id ? null : id)
    }

    return (
        <div className="overflow-hidden  border border-gray-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50/50">
                    <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Vehicle</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Details</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
                        <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Price</th>
                        <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                    {cars.map((car) => {
                        const status = car.carValidationStatus
                            ? car.carValidationStatus.charAt(0).toUpperCase() + car.carValidationStatus.slice(1)
                            : "Pending"
                        
                        return (
                            <tr key={car.id} className="transition-colors hover:bg-gray-50/50">
                                <td className="whitespace-nowrap px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <div className="relative h-12 w-16 shrink-0 overflow-hidden  bg-gray-100 border border-gray-200">
                                            {car.carImages?.[0]?.url ? (
                                                <Image 
                                                    src={car.carImages[0].url} 
                                                    alt={`${car.make} ${car.model}`}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
                                                    <span className="text-xs">No Image</span>
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900">{car.make} {car.model}</div>
                                            <div className="text-xs text-gray-500">{car.title}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                    <div className="flex flex-col gap-1.5 text-xs text-gray-600">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="h-3.5 w-3.5 text-gray-400" />
                                            {car.year} • {car.mileage?.toLocaleString() || 0} km
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Settings className="h-3.5 w-3.5 text-gray-400" />
                                            {car.transmissionType !== "Default" ? car.transmissionType : "Auto"} • {car.fuelType !== "Default" ? car.fuelType : "Petrol"}
                                        </div>
                                    </div>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                    <span className={`inline-flex items-center  border px-2.5 py-1 text-xs font-medium ${getStatusColor(status)}`}>
                                        {status}
                                    </span>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-right">
                                    <div className="text-sm font-semibold text-gray-900">
                                        ฿{car.price?.toLocaleString() || 0}
                                    </div>
                                </td>
                                <td className="relative whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                    <button 
                                        onClick={() => toggleMenu(car.id)}
                                        className=" p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none"
                                        onBlur={() => setTimeout(() => setActiveMenuId(null), 200)}
                                    >
                                        <MoreHorizontal className="h-5 w-5" />
                                    </button>
                                    
                                    {activeMenuId === car.id && (
                                        <div className="animate-in fade-in zoom-in-95 absolute right-8 top-10 z-20 w-48 overflow-hidden  border border-gray-200 bg-white py-1.5 shadow-sm shadow-gray-200/50 ring-1 ring-black/5 duration-100">
                                            <button 
                                                onClick={() => onEdit(car.id)}
                                                className="group/item flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-blue-50 hover:text-blue-600"
                                            >
                                                <Pencil className="h-4 w-4 text-gray-400 group-hover/item:text-blue-600 transition-colors" /> 
                                                Edit Details
                                            </button>
                                            <div className="mx-2 my-1 h-px bg-gray-100" />
                                            <button 
                                                onClick={() => onDelete(car.id)}
                                                className="group/item flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-red-50 hover:text-red-600"
                                            >
                                                <Trash2 className="h-4 w-4 text-gray-400 group-hover/item:text-red-600 transition-colors" /> 
                                                Delete Vehicle
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}
