export default class ApiOptions {
  requestType: string;
  query: any;
  body: any;

  constructor(requestType: string, query: any, body: any) {
    this.requestType = requestType;
    this.query = query;
    this.body = body;
  }
}
