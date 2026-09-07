import http from 'http';

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');

  switch (req.url) {
    case '/hello':
      res.end(JSON.stringify({
        message: 'Hello, students!'
      }));
      break;

    case '/time':
      res.end(JSON.stringify({
        time: new Date().toISOString()
      }));
      break;

    case '/about':
      res.end(JSON.stringify({
        message: 'This is a Vanilla Node.js backend'
      }));
      break;

    default:
      res.statusCode = 404;
      res.end(JSON.stringify({
        message: 'Endpoint not found'
      }));
  }
});

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});