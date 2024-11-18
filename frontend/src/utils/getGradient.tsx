import React from 'react';

export const getGradient = () => {
  let selectedStyle = Number(localStorage.getItem("selectedStyle"));
  if (!selectedStyle) {
    selectedStyle = 0;
  }

  const gradientsBlock = [
    <linearGradient id="paint0_linear_619_10702" x1="50.1029" y1="39.1668" x2="419.193" y2="42.1573" gradientUnits="userSpaceOnUse">
      <stop stopColor="#90D7ED" />
      <stop offset="0.49" stopColor="#6887C4" />
      <stop offset="1" stopColor="#8085C0" />
    </linearGradient>,
    <linearGradient id="paint0_linear_619_10702" x1="50.1029" y1="39.1668" x2="419.193" y2="42.1573" gradientUnits="userSpaceOnUse">
      <stop offset="-1.15%" stopColor="#FF805A" />
      <stop offset="83.89%" stopColor="#DEAE53" />
    </linearGradient>,
    <linearGradient id="paint0_linear_619_10702" x1="50.1029" y1="39.1668" x2="419.193" y2="42.1573" gradientUnits="userSpaceOnUse">
      <stop offset="-59.57%" stopColor="#6ACB54" />
      <stop offset="43.7%" stopColor="#DCBB5A" />
      <stop offset="163.26%" stopColor="#E2883D" />
    </linearGradient>,
    <linearGradient id="paint0_linear_619_10702" x1="50.1029" y1="39.1668" x2="419.193" y2="42.1573" gradientUnits="userSpaceOnUse">
      <stop offset="-1.15%" stopColor="#FF805A" />
      <stop offset="83.89%" stopColor="#DEAE53" />
    </linearGradient>
  ];

  return gradientsBlock[selectedStyle];
}