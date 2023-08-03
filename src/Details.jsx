import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import fetchPet from './fetchPet';
import Carousel from '../Carousel';
import ErrorBoundary from '../ErrorBoundary';

const Details = () => {
  const { id } = useParams(); // BrowserRouter is doing the magic to pass id
  // Using React Query explanation
  // search the key 'details' with the value id
  // if it's not in the cache, run fetchPet
  const results = useQuery(['details', id], fetchPet);

  if (results.isError) {
    // if there is an error apparently React Query tries to re-fetch 3 times before getting to here
    return <h2>oh no!</h2>;
  }

  if (results.isLoading) {
    return (
      <div className="loading-pane">
        <h2 className="loader">🌀</h2>
      </div>
    );
  }

  // at this point, we can assume pet is loaded 🐶
  const pet = results.data.pets[0];

  return (
    <div className="details">
      <Carousel images={pet.images} />
      <div>
        <h1>{pet.name}</h1>
        <h2>
          {pet.animal} - {pet.breed} - {pet.city}, {pet.state}
          <button>Adopt {pet.name}</button>
          <p>{pet.description}</p>
        </h2>
      </div>
    </div>
  );
};

function DetailsErrorBoundary(props) {
  // the reason we do this is because we want to cover errors everywhere inside the <ErrorBoundary> component
  // if we just wrapped the return from line 30, it wouldn't catch any potential errors
  // in useQuery, or isLoading...
  return (
    <ErrorBoundary>
      <Details {...props} />
    </ErrorBoundary>
  );
}

export default DetailsErrorBoundary;
