const express = require("express");
let { envelopes } = require("./envelopes");
const bodyParser = require("body-parser");
const { checkIfEnvelopeIsValid } = require("./utils");
const app = express();

const PORT = process.env.PORT || 4001;

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.get("/", (req, res, next) => {
  res.send("Hello world!");
});

app.get("/envelopes", (req, res, next) => {
  if (envelopes) {
    res.send({ data: envelopes });
  } else {
    res.status(404).send();
  }
});

app.get("/envelopes/:id", (req, res, next) => {
  const id = req.params.id;
  const foundEnvelope = envelopes.find((env) => env.id === id);

  if (foundEnvelope) {
    res.send({ data: foundEnvelope });
  } else {
    res.status(404).send();
  }
});

app.post("/envelopes", (req, res, next) => {
  console.log(req.body);

  const newEnvelopIsValid = checkIfEnvelopeIsValid(req.body);
  if (newEnvelopIsValid) {
    const newEnvelope = {
      id: `${envelopes.length + 1}`,
      category: req.body.category,
      monthlyBudget: req.body.monthlyBudget,
      balance: req.body.balance || 0,
    };
    envelopes.push(newEnvelope);
    res.status(201).send(newEnvelope);
  } else {
    res.status(404).send("Not found");
  }
});

app.put("/envelopes/:id", (req, res, next) => {
  const id = req.params.id;
  const body = req.body;
  const index = envelopes.findIndex((env) => env.id === id);
  let foundEnvelope = envelopes.find((env) => env.id === id);

  if (index > -1 && foundEnvelope) {
    foundEnvelope = {
      id: id,
      category: body.category ? body.category : foundEnvelope.category,
      monthlyBudget: body.monthlyBudget
        ? body.monthlyBudget
        : foundEnvelope.monthlyBudget,
      balance: body.balance ? body.balance : foundEnvelope.balance,
    };
    envelopes[index] = foundEnvelope;
    res.status(201).send({ data: foundEnvelope });
  } else {
    res.status(404).send();
  }
});

app.delete("/envelopes/:id", (req, res, next) => {
  const id = req.params.id;
  const index = envelopes.findIndex((env) => env.id === id);

  if (index > -1) {
    envelopes = envelopes.filter((env) => env.id !== id);
    res.status(204).send();
  } else {
    res.status(404).send();
  }
});

app.put("/envelopes/transfer/:from/:to", (req, res, next) => {
  const fromId = req.params.from;
  const toId = req.params.to;
  const transferredMoney = req.body.transferredMoney;
  const indexFrom = envelopes.findIndex((env) => env.id === fromId);
  const indexTo = envelopes.findIndex((env) => env.id === toId);

  if (!(indexFrom > -1)) {
    res
      .status(404)
      .send(`can't find the "from" envelop with the id: ${fromId}`);
  }
  if (!(indexTo > -1)) {
    res.status(404).send(`can't find the "to" envelop with the id: ${toId}`);
  }

  if (transferredMoney > envelopes[indexFrom].balance) {
    res.status(400).send("Balance can't be 0");
  }

  envelopes[indexFrom] = {
    ...envelopes[indexFrom],
    balance: envelopes[indexFrom].balance - transferredMoney,
  };
  envelopes[indexTo] = {
    ...envelopes[indexTo],
    balance: envelopes[indexTo].balance + transferredMoney,
  };

  res.status(201).send({ data: envelopes[indexTo] });
});

app.listen(PORT, () => {
  console.log(`The server is listening on port ${PORT}`);
});
