import { VercelRequest, VercelResponse } from '@vercel/node';

export declare type VercelAsynchronousApiHandler<
  Request extends VercelRequest = VercelRequest,
  Response extends VercelResponse = VercelResponse,
> = (request: Request, response: Response) => Promise<void>;

export const allowCORS =
  <
    Request extends VercelRequest = VercelRequest,
    Response extends VercelResponse = VercelResponse,
  >(
    apiHandler: VercelAsynchronousApiHandler<Request, Response>,
  ): VercelAsynchronousApiHandler<Request, Response> =>
  async (req, res) => {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET,OPTIONS,PATCH,DELETE,POST,PUT',
    );
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
    );
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }
    return await apiHandler(req, res);
  };
