import React, { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";

const SpotReview = () => {
  const [rating, setRating] = useState<number[]>([]);
  const [hover, setHover] = useState<number>(0);

  const addRating = (newRating: number) => {
    setRating([...rating, newRating]);
  };

  const reviewCount = rating.length;

  const reviewAverage: number =
    rating.length === 0 ? 0 : rating.reduce((a, b) => a + b) / rating.length;

  const roundedReviewAverage: string = reviewAverage.toFixed(1);

  return (
    <div className="flex">
      <p className="pr-2">Review this spot:</p>
      {[...Array(5)].map((star, i) => {
        const ratingValue = i + 1;

        return (
          <>
            <label>
              <input
                className="hidden"
                type="radio"
                name="rating"
                value={ratingValue}
                onClick={() => addRating(ratingValue)}
              />

              <FaStar
                className="cursor-pointer"
                size={20}
                color={ratingValue <= hover ? "#ffc107" : "e4e5e9"}
                onMouseEnter={() => setHover(ratingValue)}
                onMouseLeave={() => setHover(0)}
              />
            </label>
          </>
        );
      })}

      <div className="pl-4 font-medium flex">
        <FaStar size={20} color="#ffc107" />
        <div className="pl-2">{roundedReviewAverage}</div>
        <div className="pl-2">({reviewCount} reviews)</div>
      </div>
    </div>
  );
};

export default SpotReview;
