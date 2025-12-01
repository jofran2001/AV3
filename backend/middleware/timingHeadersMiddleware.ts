import { Request, Response, NextFunction } from 'express';

export function timingHeadersMiddleware(req: Request, res: Response, next: NextFunction) {
  const requestStartTime = Date.now();
  const requestStartHrTime = process.hrtime();
  
  if (!res.headersSent) {
    res.setHeader('X-Request-Received-At', requestStartTime.toString());
  }
  
  const originalEnd = res.end;
  let responseStartTime: [number, number] | null = null;
  
  res.end = function(...args: any[]): any {
    responseStartTime = process.hrtime();
    
    const totalTime = calculateTime(requestStartHrTime, responseStartTime);
    
    if (!res.headersSent) {
      res.setHeader('X-Response-Time', `${totalTime.toFixed(2)}ms`);
      res.setHeader('X-Server-Timestamp', Date.now().toString());
    }
    
    return originalEnd.apply(res, args as any);
  };
  
  next();
}


function calculateTime(start: [number, number], end: [number, number]): number {
  const diff = process.hrtime(start);
  return (diff[0] * 1000) + (diff[1] / 1_000_000);
}
