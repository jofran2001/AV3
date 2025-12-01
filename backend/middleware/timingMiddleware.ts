import { Request, Response, NextFunction } from 'express';

export function timingMiddleware(req: Request, res: Response, next: NextFunction) {
  const requestArrivalTime = process.hrtime();
  
  let processingStartTime: [number, number] | null = null;
  
  const originalWrite = res.write;
  const originalEnd = res.end;
  let responseStartTime: [number, number] | null = null;
  
  res.write = function(...args: any[]): any {
    if (!responseStartTime) {
      responseStartTime = process.hrtime();
    }
    return originalWrite.apply(res, args as any);
  };
  
  res.end = function(...args: any[]): any {
    if (!responseStartTime) {
      responseStartTime = process.hrtime();
    }
    return originalEnd.apply(res, args as any);
  };
  
  res.on('finish', () => {
    const finishTime = process.hrtime();
    
    const totalTime = calculateTime(requestArrivalTime, finishTime);
    
    let processingTime = 0;
    let responseTime = 0;
    
    if (processingStartTime && responseStartTime) {
      processingTime = calculateTime(processingStartTime, responseStartTime);
      
      responseTime = calculateTime(responseStartTime, finishTime);
    } else {
      processingTime = totalTime;
    }
    
    const statusColor = getStatusColor(res.statusCode);
    const methodColor = getMethodColor(req.method);
    const totalTimeColor = getTimeColor(totalTime);
    const processingTimeColor = getTimeColor(processingTime);
    const responseTimeColor = getTimeColor(responseTime);
    
    const contentLength = res.get('Content-Length') || 'unknown';
    
    console.log(
      `${methodColor}[${req.method}]${resetColor} ` +
      `${req.originalUrl} - ` +
      `${statusColor}${res.statusCode}${resetColor} - ` +
      `⏱️  Total: ${totalTimeColor}${totalTime.toFixed(2)}ms${resetColor} | ` +
      `🔧 Processamento: ${processingTimeColor}${processingTime.toFixed(2)}ms${resetColor} | ` +
      `📤 Envio: ${responseTimeColor}${responseTime.toFixed(2)}ms${resetColor} | ` +
      `📦 ${contentLength} bytes`
    );
  });
  
  processingStartTime = process.hrtime();
  
  next(); 
}


function calculateTime(start: [number, number], end: [number, number]): number {
  const diff = process.hrtime(start);
  return (diff[0] * 1000) + (diff[1] / 1_000_000);
}

const resetColor = '\x1b[0m';

function getStatusColor(statusCode: number): string {
  if (statusCode >= 200 && statusCode < 300) {
    return '\x1b[32m'; // Verde - Sucesso
  } else if (statusCode >= 300 && statusCode < 400) {
    return '\x1b[36m'; // Ciano - Redirecionamento
  } else if (statusCode >= 400 && statusCode < 500) {
    return '\x1b[33m'; // Amarelo - Erro do cliente
  } else if (statusCode >= 500) {
    return '\x1b[31m'; // Vermelho - Erro do servidor
  }
  return '\x1b[37m'; // Branco - Outros
}

function getMethodColor(method: string): string {
  switch (method) {
    case 'GET':
      return '\x1b[34m'; // Azul
    case 'POST':
      return '\x1b[32m'; // Verde
    case 'PUT':
      return '\x1b[33m'; // Amarelo
    case 'DELETE':
      return '\x1b[31m'; // Vermelho
    case 'PATCH':
      return '\x1b[35m'; // Magenta
    default:
      return '\x1b[37m'; // Branco
  }
}

function getTimeColor(timeMs: number): string {
  if (timeMs < 100) {
    return '\x1b[32m'; // Verde - Rápido (< 100ms)
  } else if (timeMs < 500) {
    return '\x1b[33m'; // Amarelo - Normal (100-500ms)
  } else if (timeMs < 1000) {
    return '\x1b[35m'; // Magenta - Lento (500ms-1s)
  } else {
    return '\x1b[31m'; // Vermelho - Muito lento (> 1s)
  }
}
