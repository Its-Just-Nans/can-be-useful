import cookie from "cookie";
import polka from "polka";

const p = polka({
  onNoMatch: (req, res) => {
    console.log(req.url);
    res.end("not found");
  },
});

p.get("/bookit/api/login", (req, res) => {
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("cookieName", "value", {
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: true,
      signed: true,
      path: "/test-path",
      domain: "myDomain",
    })
  );
  res.end(JSON.stringify("user"));
}).get("/bookit/api/users", (req, res) => {
  res.end(JSON.stringify(["user1", "user2"]));
});

p.listen(8080, () => {
  console.log(`> Running on localhost:8080`);
});
