const path = require('path');
const fs = require('fs');

fs.writeFile(
    path.join(__dirname, 'project-dist', 'bundle.css'),
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
                    path.join(__dirname, 'project-dist', 'bundle.css'),
                    data,
                    err => {
                        if (err) throw err;
                    }
                ));
                stream.on('error', error => console.log('Error', error.message));    
            }
        }
    }

})
