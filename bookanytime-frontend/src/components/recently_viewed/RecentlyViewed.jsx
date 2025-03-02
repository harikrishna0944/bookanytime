import React from 'react';
import { CCard, CCardBody, CCardImage, CCardText } from '@coreui/react';
import ItemsSlider from './ItemsSlider';

const RecentlyViewed = () => {
  const topDealsItems = [
    { title: 'Sunset Valley', category: "Farmhouse", location: 'Banglore, Karnataka', rating: 4.5, image: 'https://r1imghtlak.mmtcdn.com/a7337cd0748a11eb9b540242ac110005.jpg' },
    { title: 'Paradise Banquet', category: "Banquet Hall", location: 'Hyderabad, Telangana', rating: 4.2, image: 'https://www.wdesignhub.com/wp-content/uploads/2021/04/Banquet-Hall-Designing-7.jpg' },
    { title: 'Zmark', category: "Service Apartment", location: 'Vijayawada, Telangana', rating: 4.7, image: 'https://images.adsttc.com/media/images/66f6/0501/2684/7b25/6132/fe3e/newsletter/taiyo-service-apartment-ho-khue-architects_1.jpg?1727399203' },
    { title: 'Gather Hub', category: "Event Space", location: 'Mysore, Karnataka', rating: 4.3, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0LjoqAEABMDkIwCg8rVo-SsIxzZB9-jt0_w&s' },
    { title: 'Sunset Valley', category: "Stay cations", location: 'Hyderabad, Telangana', rating: 4.6, image: 'https://images.everydayhealth.com/images/infectious-diseases/coronavirus/how-to-staycation-during-a-pandemic-alt-722x406.jpg' },
    { title: 'Hillside Hens', category: "FarmHouse", location: 'Miami', rating: 4.4, image: 'https://media.istockphoto.com/id/879361282/photo/typical-wooden-small-farm-house-in-victorian-style-in-williamstown.jpg?s=612x612&w=0&k=20&c=tMtLuiMyOtRaAucO5SiHJysHAuQtIKyKPtI0sy2izyw=' },
    { title: 'Vishali Banquet', category: "Banquet Hall", location: 'Banglore, Karnataka', rating: 4.8, image: 'https://i.pinimg.com/564x/c0/0d/c7/c00dc727f83a12e61d91e3d163042c65.jpg' },
  ];
  return (
    <ItemsSlider title="Recently Viewed">
      {topDealsItems.map((hotel, index) => (
        <span key={index}  style={{ height:"280px" }}>
          <CCard style={{ width: '240px' ,height:"280px" }}>
            <CCardImage orientation="top" src={hotel.image} style={{maxHeight:"150px"}}/>
            <CCardBody>
              <div className="p-4">
                <h5 className="font-bold text-lg text-gray-800 mb-1">{hotel.title}</h5>
                <h6 className="font-bold text-lg text-blue-600">{hotel.category}</h6>

                <p className="text-gray-600 mb-2">{hotel.location}</p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="text-yellow-500">★</span>
                    <span className="ml-1 text-gray-700">{hotel.rating}</span>
                  </div>
                </div>
              </div>
            </CCardBody>
          </CCard>
        </span>
      ))}
    </ItemsSlider>
  );
};

export default RecentlyViewed;
