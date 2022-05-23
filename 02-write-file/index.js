const {stdin, stdout, exit} = process;
const fs = require('fs');
const path = require('path');
const eventEmitter = require('events');
const emitter = new eventEmitter();

fs.writeFile (
    path.join(__dirname, "text.txt"),
    '',
    err => {
        if(err) throw err;
    }
);

stdout.write('enter data\n');

process.on('SIGINT', () => {
    stdout.write('see you later...\n');
    exit();
});

stdin.on('data', data=>{
    let dataStringified = data.toString();
    dataStringified = dataStringified.slice(0, dataStringified.length-2);
    if(dataStringified === "exit"){
        stdout.write('See U later...\n');
        exit();
    }
    fs.appendFile(
        path.join(__dirname, 'text.txt'),
        data,
        err => {
            if (err) throw err;
        }
    )
});


