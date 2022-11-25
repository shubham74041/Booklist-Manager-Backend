require("dotenv").config();
const client = require("./connection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET = { secret: "Welcome" };

const registerUser = async (req, res) => {
  try {
    const email = req.body.email.toLowerCase();
    const password = await bcrypt.hash(req.body.password, 10);
    client.query(
      "select * from signup where email =$1",
      [email],
      async (err, result) => {
        if (result.rows.length) {
          if (result.rows[0].email === email) {
            res.status(400).json({ message: "email already exists" });
          }
        } else {
          client.query(
            'insert into signup("email","password") values($1,$2)',
            [email, password],
            (err, result) => {
              res.send("suuccessfull");
            }
          );
        }
      }
      // }
    );
  } catch (error) {
    res.send({ message: error });
  }
};

const loginUser = async (req, res) => {
  try {
    const email = req.body.email.toLowerCase();
    const password = req.body.password;
    client.query(
      "select * from signup where email =$1",
      [email],
      async (err, results) => {
        if (results.rows.length) {
          const comparePassword = await bcrypt.compare(
            password,
            results.rows[0].password
          );
          if (!comparePassword) {
            res.status(400).json({ message: "Incorrecct Password" });
          } else {
            const emailId = { email: req.body.email };
            const accessToken = jwt.sign(email, process.env.ACCESS_TOKEN);
            res.status(200).json({ accessToken });
          }
        } else {
          res.status(400).json({ message: "Email Not Found" });
        }
      }
    );
  } catch (error) {
    res.send({ message: error });
  }
};

const revealData = (req, res, next) => {
  const header = req.headers["token"];
  const token = header && header.split(" ")[1];
  if (token == null) {
    return res.status(401).json({ message: "token not found" });
  }
  jwt.verify(token, process.env.ACCESS_TOKEN, (err, email) => {
    if (err) {
      return res.status(403).json({ message: "token not valid" });
    }
    res.json(SECRET);
  });
};

const email = async (req, res) => {
  try {
    const email = req.body.email.toLowerCase();
    client.query(
      "select * from signup where email =$1",
      [email],
      async (err, results) => {
        if (err) {
          return;
        }
        if (results.rows.length) {
          return res.status(401).json({ message: "email found" });
        } else {
          res.send({ message: "Email Not Found" });
        }
      }
    );
  } catch (error) {
    res.send({ message: error });
  }
};

const forgotPassword = (req, res, next) => {
  try {
    const email = req.body.email.toLowerCase();
    const password = req.body.password;
    client.query("select * from signup where email =$1", [email]);
  } catch (error) {
    res.send({ message: error });
  }
};

const bookListData = (req, res) => {
  client.query("select * from bookinfo", async (err, results) => {
    res.send(results);
  });
};

module.exports = {
  registerUser,
  loginUser,
  revealData,
  email,
  forgotPassword,
  bookListData,
};
