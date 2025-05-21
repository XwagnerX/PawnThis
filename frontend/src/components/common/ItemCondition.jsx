import React from 'react';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';

const ItemCondition = ({ condition }) => {
  const getStars = () => {
    switch (condition.toLowerCase()) {
      case 'excelente':
        return (
          <>
            <FaStar className="star-icon" />
            <FaStar className="star-icon" />
            <FaStar className="star-icon" />
          </>
        );
      case 'bueno':
        return (
          <>
            <FaStar className="star-icon" />
            <FaStar className="star-icon" />
          </>
        );
      case 'regular':
        return <FaStar className="star-icon" />;
      case 'usado':
        return <FaStarHalfAlt className="star-icon" />;
      default:
        return null;
    }
  };

  return (
    <div className="item-condition">
      {getStars()}
    </div>
  );
};

export default ItemCondition; 