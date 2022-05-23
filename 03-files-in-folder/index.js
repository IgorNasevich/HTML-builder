const path = require('path');
const fs = require('fs');


let i = 0;
const files = fs.readdir(path.join(__dirname, 'secret-folder',), {withFileTypes:true}, (err, files) => {
    for (const file of files){
        let result = '';
        if(file.isFile()){
            fs.stat(path.join(__dirname, "secret-folder", file.name), (err, stats) => {
                result = file.name.split('.')[0] + " - " + file.name.split('.')[1] +  " - " + stats.size + "b";
                console.log(result);
            })
        }
    }
});




    
