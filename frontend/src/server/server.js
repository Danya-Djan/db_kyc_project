import express from "express";
import ReactDOM from "react-dom/server";
import { App } from "../App";
import { indexTemplate } from "./indexTemplate";
import compression from 'compression';
const app = express();

app.use(compression());
app.use("/static", express.static("./dist/client"));

app.get("*", (req, res) => {
  res.send(indexTemplate(ReactDOM.renderToString(App())));
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`server started on port ${port}`);
});

