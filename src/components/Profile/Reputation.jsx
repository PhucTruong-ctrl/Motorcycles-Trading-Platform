import React from "react";

const Reputation = ({ reps }) => {
  if (!reps || reps.length === 0) {
    return (
      <div className="text-grey text-center text-2xl font-light">
        No reputation data
      </div>
    );
  }

  const positiveReps = reps.filter((rep) => rep.is_positive_rep);
  const negativeReps = reps.filter((rep) => !rep.is_positive_rep);
  const positiveRepPercentage = Math.round(
    (positiveReps.length / reps.length) * 100
  );
  const negativeRepPercentage = Math.round(
    (negativeReps.length / reps.length) * 100
  );

  console.log("Pos Rep: ", positiveRepPercentage);
  console.log("Neg Rep: ", negativeRepPercentage);

  let message = "";
  let color = "";

  if (positiveRepPercentage === 0 && negativeRepPercentage === 0) {
    message = "No reputation";
    color = "text-black";
  } else if (positiveRepPercentage === 0 && negativeRepPercentage > 0) {
    message = "Negative";
    color = "text-red";
  } else if (positiveRepPercentage > 0 && positiveRepPercentage <= 20) {
    message = "Mostly Negative";
    color = "text-red";
  } else if (positiveRepPercentage > 0 && positiveRepPercentage <= 40) {
    message = "Very Negative";
    color = "text-red";
  } else if (positiveRepPercentage > 0 && positiveRepPercentage <= 60) {
    message = "Mixed";
    color = "text-yellow-600";
  } else if (positiveRepPercentage > 0 && positiveRepPercentage <= 80) {
    message = "Positive";
    color = "text-green-600";
  } else if (positiveRepPercentage > 0 && positiveRepPercentage <= 100) {
    message = "Very Positive";
    color = "text-green-600";
  }

  return (
    <div className="flex flex-row justify-center items-center gap-1 text-2xl font-light text-grey">
      <span>Reputations:</span>
      <div className="p-2.5">
        <span className={color}>
          {positiveRepPercentage}% {message}
        </span>
      </div>
    </div>
  );
};

export default Reputation;
