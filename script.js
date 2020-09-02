const express = require('express');
const Joi = require('joi');
const app = express();
app.use(express.json());

const customers = [
  {title: 'Mary', id: 1},
  {title: 'Jane', id: 2},
  {title: 'Amy', id: 3},
  {title: 'Betsy', id: 4},
  {title: 'Carol', id: 5}
]

app.get('/', (req, res) => { res.send('Welcome to Chapman Rest API!'); });

app.get('/api/customers', (req, res) => {res.send(customers); });

app.get('/api/customers/:id', (req, res) => {
  const customer = customers.find(c => c.id === parseInt(req.params.id));
  if (!customer)
    res.status(404).send('<h2 style="font-family: Times New Roman; color: darkred">Ooops. Cannot find the name</h2>');
  res.send(customer);
});

app.post('/api/customers', (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) {
     res.status(400).send(error.details[0].message);
      return;
  }
  const customer = {
     id: customers.length + 1,
     title: req.body.title
  };
  customers.push(customer);
  res.send(customer);
});

app.put('/api/customers/:id', (req, res) => {
    const customer = customers.find(c => c.id === parseInt(req.params.id));
    if (!customer)
        res.status(404).send('<h2 style="font-family: Times New Roman; color: darkred">Ooops. Cannot find the name</h2>');
    const { error } = validateCustomer(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }
    customer.title = req.body.title;
    res.send(customer);
});

app.delete('/api/customers/:id', (req, res) => {
        const customer = customers.find(c => c.id === parseInt(req.params.id));
        if (!customer)
            res.status(404).send('<h2 style="font-family: Times New Roman; color: darkred">Ooops. Cannot find the name</h2>');
        const index = customers.indexOf(customer);
        customers.splice(index, 1);
        res.send(customer);
    });

function validateCustomer(customer) {
    const schema = Joi.object({ title: Joi.string().min(3).required() });

    return schema.validate(customer);
}
const port = process.env.PORT || 8080;
app.listen(port, () => console.log('Listening on port $(port)..'));
