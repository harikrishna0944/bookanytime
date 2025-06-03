import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import FilterSidebar from './FilterSidebar';
import PropertyCard from './PropertyCard';
import axios from './api';

const PropertyList = () => {
  const { category } = useParams();
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    if (category) {
      axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/categories`)
        .then(res => setProperties(res.data))
        .catch(err => console.error(err));
    }
  }, [category]);

  return (
    <div className="flex p-8">
      <FilterSidebar />
      <div className="flex-1 grid grid-cols-2 gap-6">
        {properties.length ? properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        )) : (
          <p className="text-gray-500">No properties found for category "{category}".</p>
        )}
      </div>
    </div>
  );
};

export default PropertyList;
