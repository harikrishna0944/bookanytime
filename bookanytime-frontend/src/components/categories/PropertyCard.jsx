const PropertyCard = ({ property }) => (
  <div className="border rounded shadow p-2">
    <div className="relative">
      <img src={property.imageUrl} alt={property.name} className="rounded w-full h-48 object-cover" />
      {property.featured && <span className="absolute top-2 left-2 bg-purple-600 text-white px-2 py-1 text-xs rounded">Featured</span>}
      {property.offer && <span className="absolute top-2 right-2 bg-orange-400 text-white px-2 py-1 text-xs rounded">{property.offer}</span>}
    </div>
    <div className="mt-2">
      <h3 className="font-semibold">{property.name}</h3>
      <p className="text-sm text-gray-600">{property.location}</p>
      <div className="text-sm text-gray-500 flex justify-between mt-1">
        <span>{property.type}</span>
        <span>{property.guests} guests</span>
      </div>
      <div className="font-bold mt-2">${property.price} <span className="text-sm font-normal">/ night</span></div>
      <div className="text-sm text-gray-500">{property.amenities.join(" • ")}</div>
      <div className="text-yellow-500 text-sm font-medium mt-1">⭐ {property.rating}</div>
    </div>
  </div>
);

export default PropertyCard;
