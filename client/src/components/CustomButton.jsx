import React from 'react';
import styles from '../styles';

const CustomButton = ({title,handLeClick,restStyles}) => {
  return (
    <button 
        type="button"
        className={`${styles.btn} ${restStyles}`}
        onClick={handLeClick}
    >
        {title}
    </button>
  )
}

export default CustomButton