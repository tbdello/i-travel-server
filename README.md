# I-Travel-server

A Server to support the i-Travel app.

An app that lets you explore the wide world of travel with pictures and stories from people who have traveled there. 

## Installation

This supports an app , found at:

https://github.com/tbdello/i-travel

This app also requires npm modules, enter : `npm i`

in the terminal before running. The default port is 3001.

## Usage

After installation, it is advisable to test to make sure the server environment is properly set up: `npm test` 
Then when all of the tests pass ok, in the terminal: `npm start`

and then open a browser to: `http://localhost:3000/`


## Contributing

1. Fork it!
1. Create your feature branch: `git checkout -b my-new-feature`
1. Commit your changes: `git commit -am 'Add some feature'`
1. Push to the branch: `git push origin my-new-feature`
1. Submit a pull request 

## History

This was created over the course of one week by students of Alchemy Code Labs.

## Credits

Created by: *Andrew Bodey, Maryus Martsyalius, Eli Speigel*

## License

MIT

## Consistency in the Code
1. good: fn()  
    bad: fn ()
1. good: let b == 'str';
   
    bad: let b=='str';
1. good: function((power, exp) => {
        })
        
    bad: function((power, exp) =>{
        })

1. one line space between unlike items
