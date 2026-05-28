// Lookup table for vehicle fuel types and locations
// Used by CarCard to display varied data without modifying CarModel type

const DETAILS: Record<string, { fuel: string; location: string }> = {
  "Porsche 911 Carrera S": { fuel: "Petrol", location: "Bangkok" },
  "Mercedes-Benz S500 4MATIC": { fuel: "Hybrid", location: "Phuket" },
  "Tesla Model Y Performance": { fuel: "Electric", location: "Bangkok" },
  "BMW X7 xDrive40i M Sport": { fuel: "Diesel", location: "Chiang Mai" },
  "Honda Civic e:HEV RS": { fuel: "Hybrid", location: "Bangkok" },
  "Audi e-tron GT Quattro": { fuel: "Electric", location: "Pattaya" },
  "Toyota Fortuner Legender 4x4": { fuel: "Diesel", location: "Nakhon Ratchasima" },
  "Lexus LM 350h Executive": { fuel: "Hybrid", location: "Bangkok" },
  "Mazda CX-5 2.0 Carbon Edition": { fuel: "Petrol", location: "Bangkok" },
  "Mercedes-AMG GT 63 S": { fuel: "Petrol", location: "Bangkok" },
  "BYD Seal Performance AWD": { fuel: "Electric", location: "Nonthaburi" },
  "Toyota Yaris Cross Premium": { fuel: "Hybrid", location: "Bangkok" },
  "Ford Ranger Raptor 2.0 Bi-Turbo": { fuel: "Diesel", location: "Rayong" },
  "MG4 Electric XPOWER": { fuel: "Electric", location: "Samut Prakan" },
  "Isuzu D-Max V-Cross 3.0 4x4": { fuel: "Diesel", location: "Udon Thani" },
  "Volvo XC60 Recharge T8": { fuel: "Plug-in Hybrid", location: "Bangkok" },
};

export function getVehicleDetail(title: string) {
  return DETAILS[title] ?? { fuel: "Petrol", location: "Bangkok" };
}
