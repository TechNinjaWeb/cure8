var aws = require('aws-sdk');
var ddb = new aws.DynamoDB({apiVersion: '2012-10-08'});
//const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
  console.log(event);

  let date = new Date();

  const tableName = "Users-yzmmgl6t4nenrkir5v5hebf2ni-macos";
  const region = process.env.REGION;
  console.log("table=" + tableName + " -- region=" + region);

  aws.config.update({region: region});
  // If the required parameters are present, proceed

    //event.requestContext.identity.email
  if (event.request.userAttributes.sub) {
    // -- Write data to DDB
    let ddbParams = {
      TableName: tableName,
      KeyConditionExpression: "email = :email",
      ExpressionAttributeValues: {
        ":email": event.request.userAttributes.email
      }
    };

    // Call DynamoDB
    /*try {
      const result = await ddb.query(ddbParams); // Return the matching list of items in response body return success(result.Items);
      return(result.json.Items)
    } catch (e) {
      return("fail");
    }*/

    await ddb.getItem(ddbParams, (err, data) => {
      if (err) {
        return ({error: 'Could not load items: ' + err});
      } else {
        console.log("Success", data.Item)
      }
    });

    console.log("Success: Everything executed correctly");
    context.done(null, event);
  }else {
    // Nothing to do, the user's email ID is unknown
    console.log("Error: Nothing was written to DDB or SQS");
    context.done(null, event);
  }

};