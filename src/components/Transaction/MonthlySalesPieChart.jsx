import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const MonthlySalesLineChart = ({ transactions }) => {
  const isNewMotorcycle = (motorcycle) => {
    const currentYear = new Date().getFullYear();
    return motorcycle?.year >= currentYear - 2;
  };

  const processData = () => {
    let newCount = 0;
    let oldCount = 0;

    transactions
      .filter((t) => t.completed)
      .forEach((transaction) => {
        if (isNewMotorcycle(transaction.motorcycle)) {
          newCount++;
        } else {
          oldCount++;
        }
      });

    return {
      new: newCount,
      old: oldCount,
      total: newCount + oldCount,
    };
  };

  const typeStats = processData();

  const data = {
    labels: ["New Motorcycles", "Old Motorcycles"],
    datasets: [
      {
        data: [typeStats.new, typeStats.old],
        backgroundColor: ["#5bb1eb", "#fb95ab"],
        hoverBackgroundColor: ["#36A2EB", "#FF6384"],
        borderWidth: 1,
        hoverOffset: 4,
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
        text: `Motorcycle Sales by Type (Total: ${typeStats.total})`,
        font: { size: 16 },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
    maintainAspectRatio: false,
  };

  if (typeStats.total > 0) {
    return <Pie data={data} options={options} />;
  }

  return null;
};

export default MonthlySalesLineChart;
