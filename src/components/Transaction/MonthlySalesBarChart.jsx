import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const MonthlySalesBarChart = ({ transactions, currentUser, selectedYear }) => {
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
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Used",
        data: monthlyStats.old,
        backgroundColor: "#FF6384",
        borderColor: "#FF6384",
        borderWidth: 1,
      },
      {
        label: "New",
        data: monthlyStats.new,
        backgroundColor: "#36A2EB",
        borderColor: "#36A2EB",
        borderWidth: 1,
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

  return <Bar data={data} options={options} />;
};

export default MonthlySalesBarChart;
