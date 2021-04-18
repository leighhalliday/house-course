import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import { useRouter } from "next/router";
import { useQuery, useMutation, gql } from "@apollo/client";
import { loadIdToken } from "src/auth/firebaseAdmin";
import { useAuth } from "src/auth/useAuth";
import {
  createSpotReview,
  createSpotReviewVariables,
} from "src/generated/createSpotReview";
import { ShowSpotQuery_spot } from "src/generated/ShowSpotQuery";
import Modal from "src/components/modal";

const ADD_SPOTREVIEW = gql`
  mutation createSpotReview($input: SpotReviewInput!) {
    createSpotReview(input: $input) {
      id
      creator
      spotId
      rating
      comments
      spot {
        id
        reviews {
          id
        }
      }
    }
  }
`;

const SpotReview: React.FC<{ spot: ShowSpotQuery_spot }> = ({ spot }) => {
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [mutate, status] = useMutation<
    createSpotReview,
    createSpotReviewVariables
  >(ADD_SPOTREVIEW);

  const addRating = (newRating: number) => {
    setIsOpen(true);

    setTimeout(function () {
      mutate({
        variables: {
          input: {
            comments: "comment",
            rating: newRating,
            spotId: spot.id, //?
          },
        },
      })
        .then(() => {
          ("");
        })
        .catch((e) => {
          alert("Oops, something went wrong. Try refreshing the page.");
        });
    }, 1000);
  };

  const reviewAverage: number =
    spot.reviews.length === 0
      ? 0
      : spot.reviews.reduce((a, b) => a + b.rating, 0) / spot.reviews.length;

  const roundedReviewAverage: string = reviewAverage.toFixed(1);

  return (
    <>
      <Modal open={isOpen} onClose={() => setIsOpen(false)}>
        Thanks for submitting your review{" "}
        <span role="img" aria-label="thumbs-up">
          👍
        </span>
      </Modal>

      <div className="flex items-center ml-auto">
        <p className="pr-4">Review this spot:</p>
        {[...Array(5)].map((star, i) => {
          const ratingValue = i + 1;

          return (
            <label key={i}>
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
                color={ratingValue <= (hover || rating) ? "#ffc107" : "e4e5e9"}
                onMouseEnter={() => setHover(ratingValue)}
                onMouseLeave={() => setHover(0)}
              />
            </label>
          );
        })}
        <div className="pl-4">
          <button
            className={
              rating === 0
                ? " cursor-not-allowed border-style: none; bg-gray-500 shadow-md text-sm text-white font-bold py-0 md:px-4 px-4 py-2 rounded uppercase  focus:outline-none"
                : "cursor-pointer bg-green-800 shadow-md text-sm text-white font-bold py-0 md:px-4 px-4 py-2 hover:bg-green-600 rounded uppercase"
            }
            onClick={
              rating > 0
                ? () => addRating(rating)
                : () => alert("Please select a rating before submitting")
            }
          >
            Submit review
          </button>
        </div>
        <div className="pl-4 font-medium flex">
          <FaStar size={20} color="#ffc107" />
          <div className="pl-2">{roundedReviewAverage}</div>
          <div className="pl-2">({spot.reviews.length} reviews)</div>
        </div>
      </div>
    </>
  );
};

export default SpotReview;
