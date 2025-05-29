document.getElementById("signupForm").addEventListener("submit", async function(e) {
  e.preventDefault();

  const data = {
    username: e.target[0].value,
    email: e.target[1].value,
    password: e.target[2].value
  };

  try {
    alert("Sign up submited!");
    const res = await fetch("http://localhost:3000/user/signUp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const result = await res.json();
    console.log(result);
    alert("Sign up submited!");
    if(result.details){
    alert("Sign up successful!");
    window.location.href = "./SignIn.html";
    }else{
        alert("Sign up faild");
    }

  } catch (err) {
    console.error("Error:", err);
    alert("Sign up failed.");
  }
});


//Login 

document.getElementById("signinForm").addEventListener("submit", async function(e) {
  e.preventDefault();

  const data = {
    email: e.target[0].value,
    password: e.target[1].value
  };

  try {
    const res = await fetch("http://localhost:3000/user/logIn", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const result = await res.json();
    console.log(result);
    if(result.token){
    alert("Sign in successful!" );

    sessionStorage.setItem("token", result.token);
    sessionStorage.setItem("userId", result.details.userId);
    window.location.href = "./index.html";
    }else{
        alert("Sign in faild");
    }
    
  } catch (err) {
    console.error("Error:", err);
    alert("Sign in failed.");
  }
});