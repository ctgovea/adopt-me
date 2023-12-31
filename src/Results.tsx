import Pet from './Pet';
import { Pet as PetType } from './APIResponsesTypes';

const Results = ({ pets }: { pets: PetType[] }) => {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {!pets.length ? (
        <h1>No Pets Found</h1>
      ) : (
        pets.map((pet) => {
          return (
            <Pet
              animal={pet.animal}
              name={pet.name}
              breed={pet.breed}
              images={pet.images}
              location={`${pet.city}, ${pet.state}`}
              key={pet.id}
              id={pet.id}
            />
          );
        })
      )}
    </div>
  );
};

export default Results;
