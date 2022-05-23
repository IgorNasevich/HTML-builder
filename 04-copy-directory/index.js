const path = require('path');
const fs = require('fs');

fs.mkdir(path.join(__dirname, 'files-copy'), {recursive:true}, err => {
    if (err) throw err;
    const files = fs.readdir(path.join(__dirname, 'files',), (err, files) => {
        function callback(err) {
            if (err) throw err;
        }
        for (const file of files){
            fs.copyFile(path.join(__dirname, "files", file), path.join(__dirname, 'files-copy', file), callback);
        };
    });
});

