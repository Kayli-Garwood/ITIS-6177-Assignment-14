const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');
const swag = require('swagger-ui-dist');
const db = require('./connection/mongo'); // eslint-disable-line
let {
  port
} = require('./configs/config');
if (process.env.PORT) port = process.env.PORT;
console.log(port);
const abs = swag.getAbsoluteFSPath();
const app = express();
const jsonParser = bodyParser.json();
app.use(cors());
app.use(jsonParser);

// graphql
const graphqlHTTP = require('express-graphql');
const {
  composeWithMongoose
} = require('graphql-compose-mongoose/node8');
const {
  schemaComposer
} = require('graphql-compose');
const customizationOptions = {}; // left it empty for simplicity, described below
const {
  Monkey
} = require('./models');
const MonkeyTC = composeWithMongoose(Monkey, customizationOptions);
schemaComposer.Query.addFields({
  monkeyById: MonkeyTC.getResolver('findById'),
  monkeyByIds: MonkeyTC.getResolver('findByIds'),
  monkeyOne: MonkeyTC.getResolver('findOne'),
  monkeyMany: MonkeyTC.getResolver('findMany'),
  monkeyCount: MonkeyTC.getResolver('count'),
  monkeyConnection: MonkeyTC.getResolver('connection'),
  monkeyPagination: MonkeyTC.getResolver('pagination'),
});
schemaComposer.Mutation.addFields({
  monkeyCreateOne: MonkeyTC.getResolver('createOne'),
  monkeyCreateMany: MonkeyTC.getResolver('createMany'),
  monkeyUpdateById: MonkeyTC.getResolver('updateById'),
  monkeyUpdateOne: MonkeyTC.getResolver('updateOne'),
  monkeyUpdateMany: MonkeyTC.getResolver('updateMany'),
  monkeyRemoveById: MonkeyTC.getResolver('removeById'),
  monkeyRemoveOne: MonkeyTC.getResolver('removeOne'),
  monkeyRemoveMany: MonkeyTC.getResolver('removeMany'),
});
const graphqlSchema = schemaComposer.buildSchema();
app.use('/graphql', graphqlHTTP({
  schema: graphqlSchema,
  graphiql: true
}));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  return next();
});
app.use('/health', (req, res) => res.status(200).json({
  healthy: true,
  time: new Date().getTime()
}));

// routes

app.use([require('./router/monkey')]);
const indexContent = fs.readFileSync(`${abs}/index.html`).toString().replace("https://petstore.swagger.io/v2/swagger.json", `http://localhost:${port}/swagger.json`);
app.use('/swagger.json', express.static('./swagger.json'));
app.get("/", (req, res) => res.send(indexContent));
app.get("/index.html", (req, res) => res.send(indexContent));
app.use(express.static(abs));
app.listen(port, () => console.log(`SugarKubes API: ${port}!`)); // eslint-disable-line
module.exports = app; // for testing