import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useState, useContext } from 'react';
import AdoptedPetContext from './AdoptedPetContext';
import fetchPet from './fetchPet';
import Carousel from './Carousel';
import ErrorBoundary from './ErrorBoundary';
import Modal from './Modal';

const Details = () => {
  const { id } = useParams(); // BrowserRouter is doing the magic to pass id
  if (!id) {
    throw new Error('id is required');
  }

  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // Using React Query explanation
  // search the key 'details' with the value id
  // if it's not in the cache, run fetchPet
  const results = useQuery(['details', id], fetchPet);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setAdoptedPet] = useContext(AdoptedPetContext);

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
  const pet = results?.data?.pets[0];

  if (!pet) {
    throw new Error('no pet');
  }

  return (
    <div className="details">
      <Carousel images={pet.images} />
      <div>
        <h1>{pet.name}</h1>
        <h2>
          {pet.animal} - {pet.breed} - {pet.city}, {pet.state}
          <button onClick={() => setShowModal(true)}>Adopt {pet.name}</button>
          <p>{pet.description}</p>
          {showModal ? (
            // notice how we are using state (pet.name) outside of the component,
            // in a completely different div, even outside of our "root" div
            <Modal>
              <div>
                <h1>Would you like to adopt {pet.name}</h1>
                <div className="buttons">
                  <button
                    onClick={() => {
                      setAdoptedPet(pet);
                      navigate('/');
                    }}
                  >
                    Yes
                  </button>
                  <button onClick={() => setShowModal(false)}>No</button>
                </div>
              </div>
            </Modal>
          ) : null}
        </h2>
      </div>
    </div>
  );
};

function DetailsErrorBoundary() {
  // the reason we do this is because we want to cover errors everywhere inside the <ErrorBoundary> component
  // if we just wrapped the return from line 30, it wouldn't catch any potential errors
  // in useQuery, or isLoading...
  return (
    <ErrorBoundary>
      <Details />
    </ErrorBoundary>
  );
}

export default DetailsErrorBoundary;
