<h1> Codespace : Collaborative coding platform </h1>
<h3> Platform that facilitates collaborative coding with realtime code editor ,code compilation support ,  collaborative drawing board and realtime voice chat . </h3>

<h3> Live website  : https://codespace-frontend-ecru.vercel.app/ </h3>
<h3> Server code : https://github.com/Ankit-cg22/codespace-server  </h3> 

<h2>Features</h2>

- Create and join rooms 
- Real time code editor
- Collaborative real time drawing board 
- Code compilation support for c , c++ , java and python 
- User authentication and authorization using jwt 
- Feature to save code snippets . During meetings if one wants to save a code snippets he/she can do it with one click 
- Edit and delete saved snippets . One can edit the saved snippets eg to add some notes to them 
- Simple toast notification system , implemented without using any external library 

<h2>Tech/Frameworks/Packages used</h2>

<h3> Frontend </h3>

- NextJS : for building the UI
- Tailwind CSS : styling 
- Socket.io : for handling web socket requests on frontend
- axios : for making http requests 
- peerjs : for establishing peer to peer webrtc connection 


<h3> Backend </h3>

- Node JS and Express JS : for handling backend requests
- PostgreSQL : as database 
- pg : npm package for interacting with PostgreSQL database
- socket.io : for handling the websockets requests on server
- jsonwebtokens : for signing and validating jwts
- bcrypt : for hashing password
