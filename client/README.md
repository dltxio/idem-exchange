# Disclaimer

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE AND NON-INFRINGEMENT. IN NO EVENT SHALL THE COPYRIGHT HOLDERS OR ANYONE DISTRIBUTING THE SOFTWARE BE LIABLE FOR ANY DAMAGES OR OTHER LIABILITY, WHETHER IN CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

![image](https://user-images.githubusercontent.com/8411406/128594175-b79722e9-68ae-4e37-a184-ab02ade67ac3.png)
![image (1)](https://user-images.githubusercontent.com/8411406/128594174-b22d4175-271f-4987-9b05-bfa917e77479.png)

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
