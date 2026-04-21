import Image from "next/image";

export default function ConditionalCarFilter() {
  return (
    <div id="filter-container" className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Year Range */}
        <div id="year" className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            Year Range
          </label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              name="year"
              placeholder="1990"
              min={1990}
              max={2026}
              className="w-full  border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all shadow-sm"
            />
            <span className="text-gray-500 font-medium text-xs">to</span>
            <input
              type="number"
              placeholder="2026"
              name="year"
              min={1990}
              max={2026}
              className="w-full  border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Price Range */}
        <div id="price" className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            Price Range
          </label>
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                ฿
              </span>
              <input
                type="number"
                name="price"
                placeholder="Min"
                className="w-full  border border-gray-300 bg-white pl-8 pr-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all shadow-sm"
              />
            </div>
            <span className="text-gray-500 font-medium text-xs">to</span>
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                ฿
              </span>
              <input
                type="number"
                placeholder="Max"
                name="price"
                className="w-full  border border-gray-300 bg-white pl-8 pr-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Brand Group */}
        <div className="space-y-2lg:col-span-1">
          <label className="text-sm font-semibold text-gray-700">Quick Brands</label>
          <div className="flex flex-wrap gap-2">
            {[ "Tesla", "Toyota", "Honda", "BMW", "Ford" ].map((brand) => (
               <label key={brand} className="cursor-pointer">
                  <input type="checkbox" className="peer hidden" value={brand} />
                  <span className="inline-flex items-center  border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 transition-all hover:bg-gray-50 peer-checked:border-primary-500 peer-checked:bg-primary-50 peer-checked:text-primary-700">
                    {brand}
                  </span>
               </label>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-3 border-t border-gray-100 pt-4">
        <button className=" px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">
          Clear All
        </button>
        <button className=" bg-gray-900 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-gray-800">
          Apply Filters
        </button>
      </div>
    </div>
  );
}
