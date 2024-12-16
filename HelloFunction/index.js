module.exports = async function (context, req) {
    context.log("Function processed a request.");
    context.res = {
        status: 200,
        body: "Hello World"
    };
};
