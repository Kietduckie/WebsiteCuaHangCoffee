
function validateEmail(email){

    const regex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return regex.test(email);
}

function register(){

    const email =
    document.getElementById("registerEmail")?.value;

    const password =
    document.getElementById("registerPassword")?.value;

    if(!email || !password){

        alert("Vui lòng nhập đầy đủ thông tin");
        return;
    }

    if(!validateEmail(email)){

        alert("Email không hợp lệ");
        return;
    }

    if(password.length < 6){

        alert("Mật khẩu tối thiểu 6 ký tự");
        return;
    }

    localStorage.setItem(
        "user",
        JSON.stringify({
            email,
            password
        })
    );

    alert("Đăng ký thành công");
}

function login(){

    const email =
    document.getElementById("loginEmail")?.value;

    const password =
    document.getElementById("loginPassword")?.value;

    const user =
    JSON.parse(
        localStorage.getItem("user")
    );

    if(!user){

        alert("Chưa có tài khoản");
        return;
    }

    if(
        email === user.email &&
        password === user.password
    ){

        alert("Đăng nhập thành công");

    }else{

        alert("Sai email hoặc mật khẩu");
    }
}
