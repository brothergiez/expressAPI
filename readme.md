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
<code>
Method: GET<br>
endpoint: http://localhost:5000/api/auth<br>
body request (application/json):<br>
{<br>
email: brtgz.id@gmail.com,<br>
password: 1234567<br>
}<br>
</code>
