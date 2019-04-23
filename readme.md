Clone this repo and run :

<code>
npm install
</code>

after that, set for JWT Signature Key on terminal

<code>
export cms_jwtPrivateKey=your_private_key
</code>

How to use:
First you need Login to get token.
<code>
Method: GET
endpoint: http://localhost:5000/api/auth
body request (application/json):
{
email: brtgz.id@gmail.com,
password: 1234567
}
</code>
