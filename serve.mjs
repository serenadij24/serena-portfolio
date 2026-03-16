import http from 'http';
import fs from 'fs';
import path from 'path';

const port = 3000;
const root = process.cwd();

function contentType(file){
  const ext = path.extname(file).toLowerCase();
  switch(ext){
    case '.html': return 'text/html; charset=utf-8';
    case '.css': return 'text/css';
    case '.js': return 'application/javascript';
    case '.png': return 'image/png';
    case '.jpg': case '.jpeg': return 'image/jpeg';
    case '.pdf': return 'application/pdf';
    case '.svg': return 'image/svg+xml';
    default: return 'application/octet-stream';
  }
}

const server = http.createServer((req,res)=>{
  let reqPath = decodeURIComponent(req.url.split('?')[0]);
  if(reqPath === '/') reqPath = '/index.html';
  const filePath = path.join(root, reqPath);
  fs.stat(filePath, (err, stat)=>{
    if(err || !stat.isFile()){
      res.writeHead(404, {'Content-Type':'text/plain'});
      res.end('Not found');
      return;
    }
    const ct = contentType(filePath);
    res.writeHead(200, {'Content-Type': ct});
    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(port, ()=>{
  console.log(`Serving ${root} at http://localhost:${port}`);
});

process.on('SIGINT', ()=>{ console.log('Shutting down'); process.exit(); });