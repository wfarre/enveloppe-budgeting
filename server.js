const express = require("express");
let { envelopes } = require("./envelopes");
const bodyParser = require("body-parser");
const {
  checkIfEnvelopeIsValid,
  transferMoney,
  updateEnvelope,
  createNewEnvelope,
} = require("./utils");
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
  const newEnvelopIsValid = checkIfEnvelopeIsValid(req.body);
  if (newEnvelopIsValid) {
    const createdData = createNewEnvelope(req.body);
    res.status(201).send(createdData);
  } else {
    res.status(404).send("Not found");
  }
});

app.put("/envelopes/:id", (req, res, next) => {
  const id = req.params.id;
  const body = req.body;
  const index = envelopes.findIndex((env) => env.id === id);

  if (index > -1) {
    updateEnvelope(index, body);
    res.status(201).send({ data: envelopes[index] });
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
  const transferedMoney = req.body.transferedMoney;
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

  if (transferedMoney > envelopes[indexFrom].balance) {
    res.status(400).send("Balance can't be 0");
  }
  transferMoney(indexFrom, indexTo, transferedMoney);
  res.status(201).send({ data: envelopes[indexTo] });
});

app.listen(PORT, () => {
  console.log(`The server is listening on port ${PORT}`);
});
