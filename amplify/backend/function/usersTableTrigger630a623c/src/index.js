// eslint-disable-next-line
/*exports.handler = function(event, context) {
  console.log(JSON.stringify(event, null, 2));
  event.Records.forEach(record => {
    console.log(record.eventID);
    console.log(record.eventName);
    console.log('DynamoDB Record: %j', record.dynamodb);
  });
  context.done(null, 'Successfully processed DynamoDB record'); // SUCCESS with message
};*/

var aws = require('aws-sdk');
var ddb = new aws.DynamoDB({apiVersion: '2012-10-08'});
//const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
  console.log(event);

  let date = new Date();

  const tableName = "Users-bulatdev";
  const region = process.env.REGION;
  console.log("table=" + tableName + " -- region=" + region);

  aws.config.update({region: region});

  // If the required parameters are present, proceed
  if (event.request.userAttributes.sub) {

    // -- Write data to DDB
    let ddbParams = {
      Item: {
        'id': {S: event.request.userAttributes.sub},
        'email': {S: event.request.userAttributes.email},
        'friends': {L:[  {S : "No friends yet" }]},
        'friendRequests': {L:[  {S : "No friend requests yet" }]},
        'leagues': {L:[  {S : "You are not part of any league" }]}

      },
      TableName: tableName
    };

    // Call DynamoDB
    try {
      await ddb.putItem(ddbParams).promise()
      console.log("Success");
    } catch (err) {
      console.log("Error", err);
    }

    console.log("Success: Everything executed correctly");
    context.done(null, event);

  } else {
    // Nothing to do, the user's email ID is unknown
    console.log("Error: Nothing was written to DDB or SQS");
    context.done(null, event);
  }
};