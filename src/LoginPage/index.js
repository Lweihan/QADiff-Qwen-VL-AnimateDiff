import './index.css';
import LoginImage from '../img/login.svg'
import SignupImage from '../img/signup.svg'
import React, { useState } from 'react'
import { FaUserAstronaut } from "react-icons/fa6";
import { FaLock } from "react-icons/fa";
import {message} from "antd";

function Index() {

    const [formData, setFormData] = useState({
        userName: '',
        password: ''
    })

    const [isSignUp, setIsSignUp] = useState("container")

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prevData => ({...prevData, [name]: value}))

    }
    const toSignUp = () => {
        setIsSignUp("container sign-up-mode")
    }

    const toSignIn = () => {
        setIsSignUp("container")
    }

    function Login(e) {
        // 防止立刻跳转
        e.preventDefault();
        const {userName, password} = formData
        if (userName === "") message.error("用户名不能为空");
        else if (password === "") message.error("密码不能为空");
        else if (userName !== "user") message.error("该用户不存在");
        else if (password !== "123456") message.error("密码错误")
        else if (userName === "user" && password === "123456") {
            message.success("登录成功，欢迎进入Qwen-AnimateDiff")
            window.location.href = "http://127.0.0.1:3000/home";
        }
    }

    return (
      <div className={isSignUp}>
          <div className="forms-container">
              <div className="signin-signup">
                  <form className="sign-in-form" onSubmit={Login}>
                      <h2 id={"title"} className="title">正在登录</h2>
                      <div className="input-field" id={"inputUser"}>
                          <FaUserAstronaut style={{width: "100%", height: "85%", padding: "5px 2px"}}></FaUserAstronaut>
                          <input id={"userName"} name={"userName"} type={"text"} value={formData.userName} placeholder={"请输入用户名"} onChange={handleChange}/>
                      </div>

                      <div className="input-field" id={"inputPsw"}>
                          <FaLock style={{width: "100%", height: "85%", padding: "5px 2px"}}></FaLock>
                          <input id={"password"} name="password" type={"text"} value={formData.password} placeholder={"请输入密码"} onChange={handleChange}/>
                      </div>

                      <button id={"button"} type={"submit"} className="btn solid">Go!!!</button>
                  </form>

                  <form action="" className="sign-up-form">
                      <h2 className="title">开始注册</h2>
                      <div className="input-field">
                          <FaUserAstronaut style={{width: "100%", height: "85%", padding: "5px 2px"}}></FaUserAstronaut>
                          <input id={"userName"} name={"userName"} type={"text"} placeholder={"请输入用户名"} onChange={handleChange}/>
                      </div>

                      <div className="input-field">
                          <FaLock style={{width: "100%", height: "85%", padding: "5px 2px"}}></FaLock>
                          <input id={"password"} name="password" type={"text"} placeholder={"请输入密码"} onChange={handleChange}/>
                      </div>

                      <button id={"submit"} type={"button"} className="btn solid" onClick={Login}>创建账号</button>
                  </form>
              </div>
          </div>
          <div className="panels-container">
              <div className="panel left-panel">
                  <div className="content">
                      <h3>新用户?</h3>
                      <p>欢迎访问Qwen-AnimateDiff，这是我的毕业设计，希望各位导师指正</p>
                      <button className="btn transparent" onClick={toSignUp}>前往注册</button>
                  </div>

                  <img src={SignupImage} className={"image"} alt={""}/>
              </div>

              <div className="panel right-panel">
                  <div className="content">
                      <h3>开始探索</h3>
                      <p>欢迎访问Qwen-AnimateDiff，这是我的毕业设计，希望各位导师指正</p>
                      <button className="btn transparent" onClick={toSignIn}>前往登录</button>
                  </div>

                  <img src={LoginImage} className={"image"} alt={""}/>
              </div>
          </div>
      </div>
    );
}

export default Index;
