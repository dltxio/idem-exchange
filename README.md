[![CircleCI](https://circleci.com/gh/dltxio/gpib.admin/tree/master.svg?style=svg&circle-token=35d32b99c73db5d4a95c44aafa12a004753f6a57)](<https://circleci.com/gh/dltxio/gpib.admin/tree/master>)

# Disclaimer

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE AND NON-INFRINGEMENT. IN NO EVENT SHALL THE COPYRIGHT HOLDERS OR ANYONE DISTRIBUTING THE SOFTWARE BE LIABLE FOR ANY DAMAGES OR OTHER LIABILITY, WHETHER IN CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Environment Variables

Environment variables can be defined in a .env file in the root directory of the project. These need to be prefixed with REACT*APP* in order for the project to use them.

e.g. 'REACT_APP_FOO=bar'

The following environment variables are required:

| Key               | Value                      |
| :---------------- | :------------------------- |
| REACT_APP_API_URL | e.g. http://localhost:5000 |

See [example.env](./example.env) for more examples.

If using a different port for the local development server, the proxy url needs to be updated in the package.json file.

## Running the app

```bash
yarn install
yarn start
```
