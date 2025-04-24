function logger(req, res, next) { 
    console.log(`Method: ${req.method} & Url: ${req.originalUrl}`);

    if (req.method === "PATCH")
      return res.status(405).send("Patch method not allowed.");

    next();
}

export default logger;
  // next chai middleware ko function ma use hune euta parameter ho jabasamma next lai call garidaiana tabasamaa tyo  middleware paxi ko code haru run hunxa 
  // logger middleware le chai request ko information haru lai console ma print garxa