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
} from "chart.js"; // Import necessary components from Chart.js

ChartJS.register( // Register the components
  CategoryScale, // Register the category scale
  LinearScale, // Register the linear scale
  BarElement, // Register the bar element
  Title, // Register the title
  Tooltip, // Register the tooltip
  Legend // Register the legend
);

const MonthlySalesBarChart = ({ transactions, currentUser, selectedYear }) => { // Destructure props
  const processData = () => { // Function to process data
    const monthlyData = { // Initialize monthly data
      old: Array(12).fill(0),
      new: Array(12).fill(0),
    };

    transactions
      .filter( // Filter transactions based on conditions
        (t) => // Check if the transaction is completed
          t.completed &&
          t.uid_seller === currentUser?.id &&
          new Date(t.created_at).getFullYear() === selectedYear
      )
      .forEach((transaction) => { // Iterate over filtered transactions
        const month = new Date(transaction.created_at).getMonth(); // Get the month of the transaction
        if (transaction.motorcycle?.condition === "New") { // Check if the motorcycle condition is new
          monthlyData.new[month]++; // Increment the new motorcycle count for the month
        } else {
          monthlyData.old[month]++; // Increment the old motorcycle count for the month
        }
      });

    return monthlyData; // Return the processed monthly data
  };

  const monthlyStats = processData(); // Call the processData function to get monthly stats

  const data = { // Prepare data for the chart
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
    datasets: [ // Define datasets for the chart
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

  const options = { // Chart options
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
