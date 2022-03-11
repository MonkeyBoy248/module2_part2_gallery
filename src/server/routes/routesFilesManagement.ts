import { readFile } from "fs/promises";
import * as path from 'path';
import { IncomingMessage, ServerResponse } from "http";

const reader = readFile;
const isNodeError = (error: Error | unknown): error is NodeJS.ErrnoException =>
  error instanceof Error

async function readerErrorHandler (err: NodeJS.ErrnoException, res: ServerResponse) {  
  if (err.code === 'ENOENT') {
    const content = await reader(path.join(__dirname.slice(0, __dirname.indexOf('/build')), 'pages', 'views', '404.html'));
    return content;
  } else {
    return `Server error: ${err.code}`;
  }
}

async function readPageFile (filePath: string, res: ServerResponse, contentType: string | undefined) {
  try {
    const fileContent = await reader(filePath);
    res.writeHead(200, { 'Content-Type': contentType })
    res.end(fileContent, 'utf-8');
  } catch (err) {
    if (isNodeError(err)) {
      const errorResponse = await readerErrorHandler(err, res);
      typeof errorResponse === 'string' ? res.writeHead(500) : res.writeHead(200, { 'Content-Type': contentType });
      res.end(errorResponse, 'utf-8');
    }
  }
}

function getCorrectPath (req: string): string {
  const filteredRequest = req.includes('?') ? req.slice(0, req.lastIndexOf('?')) : req;
  const extension = filteredRequest.slice(req.indexOf('.'));

  if (extension === '.html') {
    return `pages/views${filteredRequest}`;
  }
  
  return filteredRequest;
}
    
export function getTargetPageFile (req: IncomingMessage, res: ServerResponse) {
  if (req.url) {
    let contentType = 'text/html';
    const requstedFileName = getCorrectPath(req.url);
    const filePath = path.join(__dirname.slice(0, __dirname.indexOf('/build')), req.url === '/' ? 'pages/views/authentication.html' : `${requstedFileName}`);
    console.log(filePath);
    const fileExtension = path.extname(filePath);

    switch(fileExtension) {
      case '.js':
        contentType = 'text/javascript';
        break
      case '.css':
        contentType = 'text/css';
        break
      case '.json':
        contentType = 'application/json';
        break 
      case '.png': 
        contentType = 'image/png';
        break
      case '.jpg': 
        contentType = 'image/jpeg';
        break
      case '.jpeg': 
        contentType = 'image/jpeg';
      break
      case '.webp':
        contentType = 'image/webp';
      break
    }
    readPageFile(filePath, res, contentType);
  }
}
