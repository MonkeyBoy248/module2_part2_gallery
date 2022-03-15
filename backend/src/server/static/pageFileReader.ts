import { promises } from "fs";
import * as path from 'path';
import { IncomingMessage, ServerResponse } from "http";

const reader = promises.readFile;
const isNodeError = (error: Error | unknown): error is NodeJS.ErrnoException =>
  error instanceof Error

export class PageFileReader {
  private static async readerErrorHandler (err: NodeJS.ErrnoException) {  
    if (err.code === 'ENOENT') {
      const content = await reader(path.join(__dirname.slice(0, __dirname.indexOf('/build')), 'frontend', 'src', 'pages', 'views', '404.html'));

      return content;
    } 

    return `Server error: ${err.code}`;
  }
  
  private static async readPageFile (filePath: string, res: ServerResponse, contentType: string | undefined) {
    try {
      const fileContent = await reader(filePath);

      res.writeHead(200, { 'Content-Type': contentType })
      res.end(fileContent, 'utf-8');
    } catch (err) {
      if (isNodeError(err)) {
        const errorResponse = await PageFileReader.readerErrorHandler(err);

        typeof errorResponse === 'string' ? res.writeHead(500) : res.writeHead(200, { 'Content-Type': contentType });
        res.end(errorResponse, 'utf-8');
      }
    }
  }
  
  private static getCorrectPath (req: string): string {
    const filteredRequest = req.includes('?') ? req.slice(0, req.lastIndexOf('?')) : req;
    const extension = filteredRequest.slice(req.indexOf('.'));
    let filePath = filteredRequest;

    switch(extension) {
      case '.html':
        filePath= `frontend/src/pages/views${filteredRequest}`;
        break
      case '.css':
        filePath= `frontend/src/pages${filteredRequest}`;
        break
    }

    return filePath;
  }
      
  static getTargetPageFile (req: IncomingMessage, res: ServerResponse) {
    if (req.url) {
      let contentType = 'text/html';
      const requestedFileName = PageFileReader.getCorrectPath(req.url);
      const filePath = path.join(__dirname.slice(0, __dirname.indexOf('/build')), req.url === '/' ? 'frontend/src/pages/views/authentication.html' : `${requestedFileName}`);
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
        case '':
          contentType = 'application/javascript'
          break
      }
      
      PageFileReader.readPageFile(filePath, res, contentType);
    }
  }
}


