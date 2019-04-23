Clone this repo and run :
<br>
<code>
npm install
</code>
<br><br>
after that, set for JWT Signature Key on terminal

<br>
<code>
export cms_jwtPrivateKey=your_private_key
</code>
<br><br>
How to use:<br>
First you need Login to get token.<br>
<br>
Method: GET<br>
endpoint: http://localhost:5000/api/auth<br>
body request (application/json):<br>
<code>
{
email: brtgz.id@gmail.com,
password: 1234567
}
</code>
