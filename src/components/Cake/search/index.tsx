import { ChangeEvent } from "react";

interface SearchCakesProps {
  onSearch: (query: string) => void;
}

const SearchCakes = ({ onSearch }: SearchCakesProps) => {
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    onSearch(event.target.value);
  };

  return (
    <form>
      <input
        id="search-cakes"
        type="text"
        placeholder="Search cake name"
        className="input input-bordered border-black max-w-xs bg-white pl-2 rounded-sm"
        onChange={handleSearchChange}
      />
    </form>
  );
};

export default SearchCakes;
