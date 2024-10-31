const checkIfEnvelopeIsValid = (envelope) => {
  if (!envelope.category || typeof envelope.category !== "string") {
    throw new Error("Category cannot be empty or be a number.");
  }
  if (
    !envelope.monthlyBudget ||
    typeof envelope.monthlyBudget !== "number" ||
    envelope.monthlyBudget === 0
  ) {
    throw new Error("MonthlyBudget cannot be equal to 0");
  }
  return true;
};

module.exports = { checkIfEnvelopeIsValid };
