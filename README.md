# I-Travel-server

A Server to support the i-Travel app.

An app that lets you explore the wide world of travel with pictures and stories from people who have traveled there. 

## Requirements

MongoDB, latest stable version of Node.js 
Sign up for AWS. Get the KEY, SECRET and make a bucket.

## Installation


1. Clone repository and change directory.

    ```
    git clone https://github.com/tbdello/i-travel-server 
    ```

1. Install dependencies.

    ```
    npm install
    ```

1. Create a `.env` file and add the following variables. Inside of the () = you provide the vaiable

    ```
    NODE_ENV=production
    MONGODB_URI='mongodb://localhost:(port that you want mongodb to run on)/test'
    AWS_KEY=(Your aws key)
    AWS_SECRET=(Your aws secret)
    S3_BUCKET=(The name of the bucket that you created)
    ```

This supports an app , found at:

https://github.com/tbdello/i-travel

The default port is 3001.

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

## Credits

Created by: *Andrew Bodey, Maryus Martsyalius, Eli Speigel*

## License

MIT
