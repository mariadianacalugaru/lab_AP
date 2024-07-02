import './App.css';
import axios from 'axios'

function App() {
  

  const submit = async () => {
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    const configuration = {
      method: "post",
      url: "https://nutriverse/api/login",
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "https://nutriverse"
      },
      data: {
        email: email,
        password: password,
      },
    };

    try {
      await axios(configuration)
        .then(res => {
          if (res.data == "No account associated to this email!"){
            alert("no account found");
          }
          else if (res.data == "Incorrect password!") {
           
            alert("incorrect password");
          }
        })
        .catch(event => {
          alert("wrong details")
          console.log(event);
        })

    }
    catch (event) {
      console.log(event);

    }
  }
  return (
    <>
      <label>email
        <input id="email" type="text" />
      </label>
      <label>
      <input id="password" type="password" />
      </label>
      <button onClick={()=>submit()}>send</button>
    </>
  );
}

export default App;
