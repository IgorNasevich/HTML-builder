const path = require('path');
const fs = require('fs');
const EventEmitter = require('events');
const emitter = new EventEmitter();
let htmlList = [];

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
    fs.readdir(path.join(__dirname, 'components',), {withFileTypes:true}, (err, files) => { 
        if(err) throw err;  
        for (const file of files){
            if(file.isFile()){
                if(file.name.split('.')[1] === 'html'){
                    fs.readFile(path.join(__dirname, 'components', file.name), (err, data) => {
                        if(err) throw err;
                        htmlList.push({
                            name: file.name.split('.')[0],
                            content: data
                        }); 
                        emitter.emit('html component has been read');
                    });   
                }
            }
        }
        let readComponentsCount = 0; 
        emitter.on('html component has been read', ()=> {
            readComponentsCount++;
            if(readComponentsCount === files.length - 1){
                emitter.emit('html list is ready');
            }
        });
    });
});

emitter.on('html list is ready', ()=>{
    fs.readFile(path.join(__dirname, "template.html"), (err, data) => {
        if(err) throw err;
        let array = data.toString().split("\n");
        let i = 0; 
        emitter.on('push the line', ()=>{
            if(i === array.length){
                emitter.emit('html is ready');
                return;
            }
            let newString = array[i];
            for(let j = 0; j < htmlList.length; j++){
                if(array[i].includes("{{" + htmlList[j].name + "}}")){
                    newString = htmlList[j].content+"\n";
                }
            }
            fs.appendFile(
                path.join(__dirname, 'project-dist', "index.html"),
                newString,
                err => {
                    if (err) throw err;
                    i++;
                    emitter.emit('push the line');
                }
            );
        }) 
        emitter.emit('push the line');           
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


