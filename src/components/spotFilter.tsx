import { useState, useRef } from "react";
import { SpotsQuery_spots } from "src/generated/SpotsQuery";
import useOutsideClick from "../utils/useOutsideClick";

interface IProps {
  spots: SpotsQuery_spots[];
}

export default function SpotFilter({ spots }: IProps) {
  const [toggle, setToggle] = useState(false);

  const ref: any = useRef();

  useOutsideClick(ref, () => {
    setToggle(!toggle);
  });

  const handleToggle = () => {
    setToggle(!toggle);
  };

  const spotSports = spots.map((spot) => spot.sports);

  const sports: any = spotSports.filter(
    (sport, index) => spotSports.indexOf(sport) === index
  );

  return (
    <div className="w-full h-24 p-8">
      <a
        role="button"
        onClick={() => handleToggle()}
        className="hover:border-white text-white text-sm px-4 py-2 border border-gray-500 rounded-full"
      >
        Type of sport
      </a>
      {toggle ? (
        <div ref={ref} className="absolute max-w-2xl mx-auto pt-4 border-white">
          <div className="shadow-md text-gray-100 border-white">
            <div className="px-6 pt-8 bg-gray-700 rounded-lg rounded-b-none font-bold">
              Filter on a sport type
            </div>
            <div className="bg-gray-700 p-6">
              {sports.map((sport: any) => (
                <div className="py-2">
                  <label
                    key={sport.id}
                    className="flex justify-start items-start"
                  >
                    <div className="bg-white border-2 rounded w-6 h-6 flex flex-shrink-0 justify-center items-center mr-2 focus-within:border-blue-500">
                      <input type="checkbox" className="opacity-0 absolute" />
                      <svg
                        className="fill-current hidden w-4 h-4 text-green-500 pointer-events-none"
                        viewBox="0 0 20 20"
                      >
                        <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                      </svg>
                    </div>
                    <div className="select-none">{sport.toUpperCase()}</div>
                  </label>
                </div>
              ))}
            </div>

            <div className="p-6 bg-gray-700 rounded-lg rounded-t-none text-right">
              <a
                className="bg-green-800 shadow-md text-sm text-white font-bold py-3 md:px-8 px-4 hover:bg-green-600 rounded uppercase"
                href="#"
              >
                Save
              </a>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
