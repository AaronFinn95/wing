bring cloud;
bring ex;
bring http;
bring testing;

let apiDefaultCors = new cloud.Api(
  cors: true
);

apiDefaultCors.get("/users", inflight (req) => {
  return {
    body: "hello world",
    status: 200
  };
});

test "GET /users has default cors headers" {
  let response = http.get(apiDefaultCors.url + "/users");

  let headers = response.headers;
 testing.Assert.numEqual(response.status, 200);

  // GET cors headers are set
 testing.Assert.strEqual(headers.get("access-control-allow-origin"), "*");
 testing.Assert.strEqual(headers.get("access-control-allow-credentials"), "false");
 testing.Assert.strEqual(headers.get("access-control-expose-headers"), "");

  // OPTIONS headers are not set
 testing.Assert.strIsNil(headers.get("access-control-allow-headers"));
 testing.Assert.strIsNil(headers.get("access-control-allow-methods"));
}

test "OPTIONS /users has default cors headers" {
  let response = http.fetch(apiDefaultCors.url + "/users", {
    method: http.HttpMethod.OPTIONS
  });

  let headers = response.headers;
 testing.Assert.numEqual(response.status, 204);

  // OPTIONS cors headers are set
 testing.Assert.strEqual(headers.get("access-control-allow-headers"), "Content-Type,Authorization,X-Requested-With");
 testing.Assert.strEqual(headers.get("access-control-allow-methods"), "GET,POST,PUT,DELETE,HEAD,OPTIONS");
 testing.Assert.strEqual(headers.get("access-control-allow-origin"), "*");

  // Other headers are not set
 testing.Assert.strIsNil(headers.get("access-control-allow-credentials"));
 testing.Assert.strIsNil(headers.get("access-control-expose-headers"));
}

