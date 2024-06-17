import React, { ChangeEvent } from "react";

interface TotalCakesProps {
  value: number;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
}

const TotalCakes = ({ value, onChange }: TotalCakesProps) => {
  return (
    <div className="flex gap-1 items-center text-gray-600">
      <label htmlFor="itemsPerPage">Show:</label>
      <select
        id="itemsPerPage"
        value={value}
        onChange={onChange}
        className="my-2.5 px-2.5 py-1.5 text-sm bg-white w-13 rounded-lg"
      >
        {[5, 10, 15, 20, 30].map(number => (
          <option key={number} value={number}>
            {number}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TotalCakes;
