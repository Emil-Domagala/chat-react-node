import express from 'express';

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`server run on: ${port}`);
});
