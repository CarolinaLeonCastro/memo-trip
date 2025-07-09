import React from 'react';
import { useNavigate } from 'react-router-dom';
import PlaceCard from '../components/Dashboard/PlaceCard';
import AppHeader from '../components/Layout/AppHeader';

const mockPlaces = [
  {
    id: '1',
    title: 'Eiffel tower',
    location: 'Paris, France',
    images: [],
    notes:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
  },
  {
    id: '2',
    title: 'Colisem',
    location: 'Rome, Italie',
    images: [],
    notes: '',
  },
];

const AllPlaces: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <AppHeader />
      <h2>All Places</h2>
      <div style={{ display: 'flex', gap: 16 }}>
        {mockPlaces.map((place) => (
          <PlaceCard
            key={place.id}
            title={place.title}
            location={place.location}
            images={place.images}
            onClick={() => navigate(`/places/${place.id}`)}
          />
        ))}
      </div>
    </div>
  );
};

export default AllPlaces;
