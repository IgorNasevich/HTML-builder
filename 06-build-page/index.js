const path = require('path');
const fs = require('fs');
const EventEmitter = require('events');
const emitter = new EventEmitter();

fs.mkdir(path.join(__dirname, 'project-dist'), {recursive:true}, err => {
    if (err) throw err;
    fs.writeFile(
        path.join(__dirname, 'project-dist', "index.html"),
        "",
        (err) => {
            if (err) throw err;
            emitter.emit('file is generated');
        }
    );    
});

emitter.on('file is generated', ()=>{
    let firstFile = '';
    fs.readFile(path.join(__dirname, 'components', "header.html"), (err, data) => {
        firstFile = data;
        emitter.emit('first file is ready to be inserted', firstFile);
    });
});

emitter.on('first file is ready to be inserted', (firstFile)=>{
    let secondFile = '';
    fs.readFile(path.join(__dirname, 'components', "articles.html"), (err, data) => {
        secondFile = data;
        emitter.emit('second file is ready to be inserted', firstFile, secondFile);
    });
});

emitter.on('second file is ready to be inserted', (firstFile, secondFile)=>{
    let thirdFile = '';
    fs.readFile(path.join(__dirname, 'components', "footer.html"), (err, data) => {
        thirdFile = data;
        emitter.emit('third file is ready to be inserted', firstFile, secondFile, thirdFile);
    });
});


emitter.on('third file is ready to be inserted', (header, articles, footer)=>{
    fs.readFile(path.join(__dirname, "template.html"), (err, data) => {
        if(err) throw err;
        let array = data.toString().split("\n");
        for(let i in array) {
            let newString = array[i];
            if(array[i].includes("{{header}}")){
                newString = header+"\n";
            }
            else if(array[i].includes("{{articles}}")){
                newString = articles+"\n";
            }
            else if(array[i].includes("{{footer}}")){
                newString = footer+"\n";
            }
            fs.appendFile(
                path.join(__dirname, 'project-dist', "index.html"),
                newString,
                err => {
                    if (err) throw err;
                }
            )
        }
        emitter.emit('html is ready');
    });
})

emitter.on('html is ready', ()=>{
    fs.writeFile(
        path.join(__dirname, 'project-dist', 'style.css'),
        "",
        (err) => {
            if (err) throw err;
        }
    );
    const files = fs.readdir(path.join(__dirname, 'styles',), {withFileTypes:true}, (err, files) => {    
        for (const file of files){
            if(file.isFile()){
                if(file.name.split('.')[1] === 'css'){
                    
                    let stream = fs.createReadStream(path.join(__dirname, 'styles', file.name), 'utf-8');
                    let data = '';
                    stream.on('data', chunk => data += chunk);
                    stream.on('end', () => 
                    fs.appendFile(
                        path.join(__dirname, 'project-dist', 'style.css'),
                        data,
                        err => {
                            if (err) throw err;
                        }
                    ));
                    stream.on('error', error => console.log('Error', error.message));    
                }
            }
        }
        emitter.emit('css is ready');
    })
});

emitter.on('html is ready', ()=>{
    fs.mkdir(path.join(__dirname, 'project-dist', 'assets'), {recursive:true}, err => {
        if (err) throw err;
        emitter.emit('assets folder is ready');
    });
});

emitter.on('assets folder is ready', () => {
    fs.mkdir(path.join(__dirname, 'project-dist', 'assets', 'fonts'), {recursive:true}, err => {
        if (err) throw err;
        const files = fs.readdir(path.join(__dirname, 'assets', 'fonts'), (err, files) => {
            function callback(err) {
                if (err) throw err;
            }
            for (const file of files){
                fs.copyFile(path.join(__dirname, 'assets', 'fonts', file), path.join(__dirname, 'project-dist', 'assets', 'fonts', file), callback);
            };
        });
        emitter.emit('fonts folder is ready');
    });
});


emitter.on('fonts folder is ready', () => {
    fs.mkdir(path.join(__dirname, 'project-dist', 'assets', 'img'), {recursive:true}, err => {
        if (err) throw err;
        const files = fs.readdir(path.join(__dirname, 'assets', 'img'), (err, files) => {
            function callback(err) {
                if (err) throw err;
            }
            for (const file of files){
                fs.copyFile(path.join(__dirname, 'assets', 'img', file), path.join(__dirname, 'project-dist', 'assets', 'img', file), callback);
            };
        });
        emitter.emit('img folder is ready');
    });
})

emitter.on('img folder is ready', () => {
    fs.mkdir(path.join(__dirname, 'project-dist', 'assets', 'svg'), {recursive:true}, err => {
        if (err) throw err;
        const files = fs.readdir(path.join(__dirname, 'assets', 'svg'), (err, files) => {
            function callback(err) {
                if (err) throw err;
            }
            for (const file of files){
                fs.copyFile(path.join(__dirname, 'assets', 'svg', file), path.join(__dirname, 'project-dist', 'assets', 'svg', file), callback);
            };
        });
    });
})