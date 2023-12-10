var pg = require('pg');
//or native libpq bindings
//var pg = require('pg').native

var conString = "postgres://ldqexpbr:ZO6mOBpYlssPucIfT-almFvg4TRQ07V9@bubble.db.elephantsql.com/ldqexpbr" //Can be found in the Details page
var client = new pg.Client(conString);
client.connect(function (err) {
    if (err) {
        return console.error('could not connect to postgres', err);
    }
    // Testing the connection
    client.query('Select * from proyectoFinal.Team', (err, result) => {
        if (!err) {
            console.log(result.rows);
        }
        else {
            console.log(err.message)
        }
        client.end();
    });
});

