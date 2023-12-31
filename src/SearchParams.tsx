import { useState, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import Results from './Results';
import useBreedList from './useBreedList';
import fetchSearch from './fetchSearch';
import AdoptedPetContext from './AdoptedPetContext';
import { Animal } from './APIResponsesTypes';

const ANIMALS: Animal[] = ['bird', 'cat', 'dog', 'rabbit', 'reptile'];

// Let's make this an uncontrolled form
const SearchParams = () => {
  const [requestParams, setRequestParams] = useState({
    location: '',
    animal: '' as Animal,
    breed: '',
  });
  const [animal, setAnimal] = useState('' as Animal);
  const [breeds] = useBreedList(animal);
  // eslint-disable-next-line no-unused-vars
  const [adoptedPet, _] = useContext(AdoptedPetContext);

  const results = useQuery(['search', requestParams], fetchSearch);
  const pets = results?.data?.pets ?? [];

  return (
    <div className="my-0 mx-auto w-11/12">
      <form
        className="mb-10 flex flex-col items-center justify-center rounded-lg bg-gray-200 p-10 shadow-lg"
        onSubmit={(e) => {
          // every time the user submits, we save the parameters
          e.preventDefault();
          const formData = new FormData(e.currentTarget); // FormData is a browser API
          const obj = {
            animal:
              (formData.get('animal')?.toString() as Animal) ?? ('' as Animal),
            breed: formData.get('breed')?.toString() ?? '',
            location: formData.get('location')?.toString() ?? '',
          };
          setRequestParams(obj);
        }}
      >
        {adoptedPet ? (
          <div className="pet image-container">
            <img src={adoptedPet.images[0]} alt={adoptedPet.name} />
          </div>
        ) : null}
        <label htmlFor="">
          Location
          <input
            id="location"
            type="text"
            name="location"
            placeholder="location"
            className="search-input"
          />
        </label>
        <label htmlFor="animal">
          Animal
          <select
            id="animal"
            className="search-input"
            value={animal}
            onChange={(e) => {
              setAnimal(e.target.value as Animal);
            }}
            onBlur={(e) => {
              setAnimal(e.target.value as Animal);
            }}
          >
            <option />
            {ANIMALS.map((animal) => (
              <option key={animal}>{animal}</option>
            ))}
          </select>
        </label>
        <label htmlFor="breed">
          Breed
          <select
            id="breed"
            disabled={breeds.length === 0}
            name="breed"
            className="search-input greyed-out-disabled"
          >
            <option />
            {breeds.map((breed) => (
              <option key={breed}>{breed}</option>
            ))}
          </select>
        </label>
        <button className="rounded border-none bg-orange-500 px-6 py-2 text-white hover:opacity-50">
          Submit
        </button>
      </form>
      <Results pets={pets} />
    </div>
  );
};

export default SearchParams;
