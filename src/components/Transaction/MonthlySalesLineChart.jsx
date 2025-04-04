import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const MonthlySalesLineChart = ({ transactions }) => {
  const isNewMotorcycle = (motorcycle) => {
    const currentYear = new Date().getFullYear();
    return motorcycle?.year >= currentYear - 2;
  };

  const processData = () => {
    const monthlyData = {
      old: Array(12).fill(0),
      new: Array(12).fill(0),
    };

    transactions
      .filter((t) => t.completed)
      .forEach((transaction) => {
        const month = new Date(transaction.created_at).getMonth();
        if (isNewMotorcycle(transaction.motorcycle)) {
          monthlyData.new[month]++;
        } else {
          monthlyData.old[month]++;
        }
      });

    return monthlyData;
  };

  const monthlyStats = processData();

  const data = {
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    datasets: [
      {
        label: "Old Motorcycles",
        data: monthlyStats.old,
        borderColor: "#FF6384",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        tension: 0.3,
        fill: false,
      },
      {
        label: "New Motorcycles",
        data: monthlyStats.new,
        borderColor: "#36A2EB",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        tension: 0.3,
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Motorcycle Sales by Type",
        font: { size: 16 },
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    animation: {
      delay: (context) => {
        return context.dataIndex * 100;
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "Number of Motorcycles Sold" },
      },
      x: {
        title: { display: true, text: "Month of the Year" },
      },
    },
    interaction: {
      mode: "nearest",
      axis: "x",
      intersect: false,
    },
  };

  return <Line data={data} options={options} />;
};

export default MonthlySalesLineChart;
