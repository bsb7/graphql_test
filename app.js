const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");

const { buildSchema } = require("graphql");
const mongoose = require("mongoose");
const Event = require("./models/event");
const app = express();

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
        // .find() = static method, find allows us to find documents in that collection so, find event documents
        // we could pass a filter, 
        // ex. Event.find({title:"test"})
        // if dont pass anything in the filter it will give us all the entries in that collections 

        return Event.find().then(events=>{
            return events.map(event =>{
              return {...event._doc }
            })
          }
        ).catch(err=>{
          throw err;
        });
      },
      createEvent: args => {
        const event = new Event({
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: +args.eventInput.price,
          date: new Date(args.eventInput.date)
        });

        return event
          .save()
          .then(result => {
            return { ...result._doc };
          })
          .catch(error => {
            throw error;
          });
      }
    },
    graphiql: true
  })
);

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-em7ev.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(4000);
  })
  .catch(err => {
    console.log(err);
  });
