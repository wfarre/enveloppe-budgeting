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

const transferMoney = (indexFrom, indexTo, transferedAmount) => {
  envelopes[indexFrom] = {
    ...envelopes[indexFrom],
    balance: envelopes[indexFrom].balance - transferedAmount,
  };
  envelopes[indexTo] = {
    ...envelopes[indexTo],
    balance: envelopes[indexTo].balance + transferedAmount,
  };
};

const updateEnvelope = (originalEnvelopeIndex, newData) => {
  let foundEnvelope = envelopes[originalEnvelopeIndex];
  foundEnvelope = {
    id: foundEnvelope.id,
    category: newData.category ? newData.category : foundEnvelope.category,
    monthlyBudget: newData.monthlyBudget
      ? newData.monthlyBudget
      : foundEnvelope.monthlyBudget,
    balance: newData.balance ? newData.balance : foundEnvelope.balance,
  };
  envelopes[originalEnvelopeIndex] = foundEnvelope;
};

const createNewEnvelope = (newData) => {
  const newEnvelope = {
    id: `${envelopes.length + 1}`,
    category: newData.category,
    monthlyBudget: newData.monthlyBudget,
    balance: newData.balance || 0,
  };
  envelopes.push(newEnvelope);
  return newEnvelope;
};

module.exports = {
  checkIfEnvelopeIsValid,
  transferMoney,
  updateEnvelope,
  createNewEnvelope,
};
