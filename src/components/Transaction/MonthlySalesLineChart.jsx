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

const MonthlySalesLineChart = ({ transactions, currentUser, selectedYear }) => {
  const processData = () => {
    const monthlyData = {
      old: Array(12).fill(0),
      new: Array(12).fill(0),
    };

    transactions
      .filter(
        (t) =>
          t.completed &&
          t.uid_seller === currentUser?.id &&
          new Date(t.created_at).getFullYear() === selectedYear
      )
      .forEach((transaction) => {
        const month = new Date(transaction.created_at).getMonth();
        if (transaction.motorcycle?.condition === "New") {
          monthlyData.new[month]++;
        } else {
          monthlyData.old[month]++;
        }
      });

    return monthlyData;
  };

  const monthlyStats = processData();

  const data = {
    labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
    datasets: [
      {
        label: "Used",
        data: monthlyStats.old,
        borderColor: "#FF6384",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        tension: 0.3,
        fill: false,
      },
      {
        label: "New",
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
        text: "Motorcycle Sales by Condition",
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
        title: { display: true, text: "Sold" },
      },
      x: {
        title: { display: true, text: "Month" },
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
