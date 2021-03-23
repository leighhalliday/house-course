import React, { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";

const SpotReview = () => {
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);
  const [totals, setTotal] = useState<Array<number>>([0]);
  const [reviewCount, setReviewCount] = useState<number>(-1);

  useEffect(() => {
    setTotal((totals) => [...totals, rating]);
    setReviewCount((reviewCount) => reviewCount + 1);
  }, [rating]);

  const reviewAverage: number = totals.reduce((a, b) => a + b) / totals.length;
  const roundedReviewAverage: string = reviewAverage.toFixed(1);

  return (
    <div className="flex">
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
                onClick={() => setRating(ratingValue)}
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
