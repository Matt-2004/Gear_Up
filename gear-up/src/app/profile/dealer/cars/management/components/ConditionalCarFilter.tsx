import Image from "next/image";

export default function ConditionalCarFilter() {
  return (
    <div id="filter-container" className="w-full">
      <div className="flex w-full flex-col gap-6">
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
              className="w-24 rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
            />
            <span className="text-gray-500 font-medium">to</span>
            <input
              type="number"
              placeholder="2026"
              name="year"
              min={1990}
              max={2026}
              className="w-24 rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
            />
          </div>
        </div>
        <div id="price" className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            Price Range
          </label>
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                ฿
              </span>
              <input
                type="number"
                name="price"
                placeholder="Min"
                className="w-full rounded-lg border border-gray-300 bg-white pl-8 pr-3 py-2 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
              />
            </div>
            <span className="text-gray-500 font-medium">to</span>
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                ฿
              </span>
              <input
                type="number"
                placeholder="Max"
                name="price"
                className="w-full rounded-lg border border-gray-300 bg-white pl-8 pr-3 py-2 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
              />
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Brand</label>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center select-none">
              <input
                id="tesla"
                type="checkbox"
                name="make"
                value="Tesla"
                className="peer hidden appearance-none"
              />
              <label
                htmlFor="tesla"
                className="flex cursor-pointer items-center gap-2 rounded-lg border-2 border-gray-300 bg-white px-4 py-2.5 transition-all hover:border-primary-400 peer-checked:border-primary-500 peer-checked:bg-primary-50 peer-checked:shadow-md"
              >
                <div className="relative h-6 w-20">
                  <Image
                    src="/tesla-text.png"
                    alt="Tesla"
                    fill
                    className="object-contain"
                  />
                </div>
              </label>
            </div>
            <div className="flex items-center select-none">
              <input
                id="toyota"
                type="checkbox"
                name="make"
                value="Toyota"
                className="peer hidden appearance-none"
              />
              <label
                htmlFor="toyota"
                className="flex cursor-pointer items-center gap-2 rounded-lg border-2 border-gray-300 bg-white px-4 py-2.5 transition-all hover:border-primary-400 peer-checked:border-primary-500 peer-checked:bg-primary-50 peer-checked:shadow-md"
              >
                <div className="relative h-6 w-20">
                  <Image
                    src="/toyota-text.png"
                    alt="Toyota"
                    fill
                    className="object-contain"
                  />
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
