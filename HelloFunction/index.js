module.exports = async function (context, req) {
  context.log('HTTP trigger processed a request.');
  context.res = {
    body: "Hello from Azure Functions!"
  };
};
