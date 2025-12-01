"use client";

import {
    ChangeEvent,
    createContext,
    ReactNode,

    useContext,
    useState,
} from "react";

type MakeTypes = "Toyota" | "Honda" | "Mazada" | "BMW" | "Ford";
type TransmissionTypes = "Automatic" | "Manual";
type CarStatusTypes = "Active" | "Reserved" | "Sold" | "Hidden";
type CarConditionTypes = "New" | "Used";

interface ICarFilterState {
    year: number;
    price: number;
    make: MakeTypes;
    transmission: TransmissionTypes;
    carStatus: CarStatusTypes;
    carCondition: CarConditionTypes;
    DateAdded: Date;
}

interface CarFilterContext extends ICarFilterState {
    handleFilter: (e: ChangeEvent) => void;
}

export const CarFilterContext = createContext<Partial<CarFilterContext>>({});

const CarFilterProvider = ({ children }: { children: ReactNode }) => {
    const [carFilter, setCarFilter] = useState<Partial<ICarFilterState>>({});
    const handleFilter = (e: ChangeEvent) => {
        const { name, value } = e.currentTarget as HTMLInputElement;
        setCarFilter((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    return (
        <CarFilterContext.Provider value={{ ...carFilter, handleFilter }}>
            {children}
        </CarFilterContext.Provider>
    );
};

export default CarFilterProvider;

export const useCarFilterContext = () => {
    const context = useContext(CarFilterContext);
    if (!context) {
        throw new Error(
            "useCarFilterContext must be used within a CarFilterProvider",
        );
    }
    return context;
};