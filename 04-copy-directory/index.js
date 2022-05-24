const path = require('path');
const fs = require('fs');
const EventEmitter = require('events');
const emitter = new EventEmitter();

fs.access(path.join(__dirname, "files-copy"), (err) => {
    if(err) {
        emitter.emit('no folder');
    }
    else{
        const files = fs.readdir(path.join(__dirname, 'files-copy',), (err, files) => {
            if (err) throw err;
            for (const file of files){
                fs.unlink(path.join(__dirname, "files-copy", file), (err) => {
                   if(err) throw err; 
                });
            }
            fs.rmdir(path.join(__dirname, "files-copy"), (err) => {
                if(err) throw err;
                emitter.emit('no folder');
            });
        });
    };
});

emitter.on('no folder', ()=>{
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
    
})

