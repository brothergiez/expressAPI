<h1><a id="Simple_REST_API_build_with_Express_0"></a>Simple REST API build with Express</h1>
<p>This repo was made for learning purposes to make Rest API simple using the Express JS framework.</p>
<p>In this mini project there are several examples needed to make a simple REST API.</p>
<ul>
<li>Make routing on express</li>
<li>Using the MongoDB database</li>
<li>Connection with MongoDB database using mongoose</li>
<li>Create a MongoDB Database Schema</li>
<li>Make CRUD operations to mongoDB</li>
<li>Make input validation using the Joi library</li>
<li>Password encryption using the Bcrypt library</li>
<li>Make user credentials using JWT (jsonwebtoken)</li>
<li>Make simple custom middleware</li>
<li>Authentication User &amp; User Authorization with custom middleware</li>
<li>Protect routes with authentication and authorization</li>
<li>and several other library uses can be seen in package.json</li>
</ul>
<h3><a id="Installation_18"></a>Installation</h3>
<p>Clone this repo</p>
<pre><code class="language-sh">$ git <span class="hljs-built_in">clone</span> https://github.com/brothergiez/expressAPI.git
</code></pre>
<p>Install the dependencies.</p>
<pre><code class="language-sh">$ <span class="hljs-built_in">cd</span> expressAPI
$ npm install 
</code></pre>
<p>Set JWT Signature Key to Environment Variables…</p>
<pre><code class="language-sh">$ <span class="hljs-built_in">export</span> cms_jwtPrivateKey=your_secure_key
</code></pre>
<p>Run the server</p>
<pre><code class="language-sh">$ node index.js
</code></pre>
<p>Or with nodemon</p>
<pre><code class="language-sh">$ nodemon index.js
</code></pre>
<p>In this mini project, if you wanna create new user you must have token because I assume the addition of a new user must be done by an administrator who has authorization.</p>
<h4><a id="Login_49"></a>Login For Administrator</h4>
<pre><code>Method          : POST
Endpoint        : http://localhost:5000/api/auth
Content-Type    : application/json
Request Body    :
{
    &quot;email&quot;:&quot;brtgz.id@gmail.com&quot;,
    &quot;password&quot;:&quot;1234567&quot;
}
</code></pre>
<h4><a id="Response_if_true_61"></a>Response if true:</h4>
<pre><code>{
    &quot;message&quot;   : &quot;Login success&quot;,
    &quot;token&quot;     : &quot;your-token&quot;
}
</code></pre>
<h4><a id="Response_if_false_68"></a>Response if false:</h4>
<pre><code>{
    &quot;error&quot;: {
        &quot;message&quot;: &quot;Email/Password not valid&quot;
    }
}
</code></pre>
<p>Wiki: <a href="https://github.com/brothergiez/expressAPI/wiki">https://github.com/brothergiez/expressAPI/wiki</a></p>
<h2><a id="License_77"></a>License</h2>
<p>MIT</p>
