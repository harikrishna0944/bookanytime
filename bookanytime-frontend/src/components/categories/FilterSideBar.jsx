const FilterSidebar = () => (
  <div className="w-64 p-4 border rounded mr-8 space-y-4">
    <h2 className="text-lg font-semibold">Filters</h2>
    <div>
      <label>Property Type</label>
      <select className="w-full mt-1 border px-2 py-1 rounded">
        <option value="farmhouse">Farmhouse</option>
      </select>
    </div>
    <div>
      <label>Price Range</label>
      <input type="range" min="0" max="1000" className="w-full" />
    </div>
    <div>
      <label>Guests</label>
      <div className="flex items-center gap-2">
        <button>-</button>
        <span>1</span>
        <button>+</button>
      </div>
    </div>
    <div>
      <label>Amenities</label>
      <div className="space-y-1">
        {['Wi-Fi', 'Pool', 'Parking', 'Kitchen', 'Air Conditioning', 'Pet Friendly'].map(a => (
          <div key={a}>
            <input type="checkbox" id={a} /> <label htmlFor={a}>{a}</label>
          </div>
        ))}
      </div>
    </div>
    <button className="bg-purple-600 text-white w-full py-2 rounded">Apply Filters</button>
  </div>
);

export default FilterSidebar;
