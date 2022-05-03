class FormError extends Error {
  constructor(msg, field) {
    super(msg);
    this.name = 'FormError';
    this.type = 'Form Error';
    this.field = field;
  }
}

class NetworkError extends Error {
  constructor(msg, status, url) {
    super(msg);
    this.name = 'NetworkError';
    this.type = 'Network Error';
    this.statusCode = status;
    this.url = url;
  }
}

export { NetworkError, FormError };
