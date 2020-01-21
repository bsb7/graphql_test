const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");

const { buildSchema } = require("graphql");
const mongoose = require("mongoose");
const Event = require("./models/event");
const app = express();

const events = [];

app.use(bodyParser.json());

app.use(
  "/graphql",
  graphqlHttp({
    schema: buildSchema(`
     type Event {
        _id: ID!
        title: String!
        description: String
        price: Float!
        date: String
    }

    input EventInput {
        title: String!
        description: String!
        price: Float!
        date: String!
    }

    type RootQuery {
        events: [Event!]!
    }

    type RootMutation{
        createEvent( eventInput:EventInput):Event
    }


    schema{
        query: RootQuery
        mutation: RootMutation
    }
    `),
    rootValue: {
      events: () => {
        return events;
      },
      createEvent: args => {
        const event = new Event({
          _id: Math.random().toString(),
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: +args.eventInput.price,
          date: new Date(args.eventInput.date)
        });

        events.push(event);
        return event;
        // return event.save().then(result =>{
        //     return {...result._doc};
        // }).catch(error =>{
        //     throw error
        // });
      }
    },
    graphiql: true
  })
);

const MongoClient = require("mongodb").MongoClient;
const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-em7ev.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});

// mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-em7ev.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`)
// .then(()=>{
//     app.listen(3001);
// })
// .catch(err =>{
//     console.log(err);
// })

app.listen(3001);
