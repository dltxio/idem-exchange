import express from "express";

export type HandlerPayload<Params = {}, QueryString = {}, Body = {}> = {
  params: Params;
  queryString: QueryString;
  body: Body;
  config: Config;
  services: Services;
};

export type RequestHandler<Params, QueryString, Body, Result> = (
  payload: HandlerPayload<Params, QueryString, Body>
) => Promise<Result | server.ErrorResponse>;

export default (
  fn: RequestHandler<any, any, any, any>,
  config: Config,
  services: Services
) => async (request: express.Request, response: express.Response) => {
  const start = Date.now();
  console.log(`----> ${request.method} ${request.url}`);
  let responseStatus: number;
  let responseBody: object;

  const payload: HandlerPayload = {
    params: request.params,
    queryString: request.query,
    body: request.body || {},
    config,
    services
  };

  try {
    const result = await fn(payload);
    responseStatus = result.statusCode || 200;
    responseBody = result;
  } catch (err) {
    console.log(err);
    responseStatus = 500;
    responseBody = {
      status: 500,
      message: "Internal Error"
    };
  }
  const end = Date.now();
  console.log(
    `<---- ${request.method} ${request.url} ${responseStatus} ${end - start}ms`
  );
  response.status(responseStatus);
  response.send(responseBody);
};
