const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const connectDB = require("./config/db");
const rootValue = require('./graphql/resolvers')
const schema = require('./graphql/schema')
const isAuth = require('./middleware/is-auth')
const dotnet = require('dotenv')
const cors = require('cors');


const app = express();
require('dotenv').config();
connectDB(process.env.MONGODB);
var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(isAuth);
app.use(
  "/graphql",
  graphqlHttp({
    schema: schema,
    rootValue: rootValue,
    graphiql: true
  })
);

app.listen(process.env.PORT || 8000);
