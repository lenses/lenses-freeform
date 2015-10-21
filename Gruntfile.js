
module.exports = function(grunt) {


  grunt.initConfig({
    flo: {
        serve: {
          options: {
            verbose: true,
            dir: './',
            
            glob: [
              '!node_modules',
              '**/*.html',
              '**/*.js',
              '**/*.css'
            ]
            ,
            /*
            resolvers: [{
                files: ['*.css'],
                callback: {
                  resourceURL: 'lenses-freeform/lenses-freeform.css',
                }
          }]
          */
          resolver: function (filepath, callback) {
                    console.log('filepath', filepath)
                    callback({
                        resourceURL: 'lenses-freeform/' + filepath,
                        /*contents: fs.readFileSync('src' + path.extname(filepath)).toString()*/
                        contents: grunt.file.read(filepath)
                        update: function() {
                          console.log(filepath+'CHANGES');
                        }
                    }),
            }         
          
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-fb-flo');

  grunt.registerTask('default', ['flo']);

};
