import React, { useRef, useEffect, useState } from 'react'
import * as THREE from 'three';
import { useGetState } from 'ahooks';
import './index.css'
import {FaUserAstronaut} from "react-icons/fa6";
import TypewriterText from "./component/typewriterText";
import {message} from "antd";

function Index() {
    // 粒子海洋
    const threeRef = useRef(null);
    const [, setCamera, getCamera] = useGetState(null);
    const [, setRenderer, getRenderer] = useGetState(null);
    const [, setScene, getScene] = useGetState(null);
    const [, setParticles, getParticles] = useGetState(null);
    const [, setCount, getCount] = useGetState(0);
    // 可变形侧边栏
    const hamburger = useRef(null);
    const blob = useRef(null);
    const blobPath = useRef(null);
    const [expoVal, setExpoVal] = useState(true);
    const [mousePosition, setMousePosition] = useState({x: 0, y: window.screen.availHeight / 2});
    const items = ['QA语言模型', 'QA扩散模型'];
    // let curX = 10;
    // let curY = 0;
    // let tarX = 0;
    // let height = window.screen.availHeight;
    // let xIteration = 0;
    // let yIteration = 0;
    // let hoverZone = 150;
    // let expandAmount = 20;
    const [curX, setCurX] = useState(10);
    const [curY, setCurY] = useState(0);
    const [tarX, setTarX] = useState(0);
    const [height, setHeight] = useState(window.screen.availHeight);
    const [xIteration, setXIteration] = useState(0);
    const [yIteration, setYIteration] = useState(0);
    const [hoverZone, setHoverZone] = useState(150);
    const [expandAmount, setExpandAmount] = useState(20);

    const SEPARATION = 100,
        AMOUNT_X = 200,
        AMOUNT_Y = 200;

    const init = () => {
        const newCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);

        newCamera.position.z = 1000;
        setCamera(newCamera);

        const newScene = new THREE.Scene();
        setScene(newScene);

        const numParticles = AMOUNT_X * AMOUNT_Y;

        const positions = new Float32Array(numParticles * 3);
        const scales = new Float32Array(numParticles);

        let i = 0,
            j = 0;

        for (let ix = 0; ix < AMOUNT_X; ix++) {
            for (let iy = 0; iy < AMOUNT_Y; iy++) {
                positions[i] = ix * SEPARATION - (AMOUNT_X * SEPARATION) / 2; // x
                positions[i + 1] = 0; // y
                positions[i + 2] = iy * SEPARATION - (AMOUNT_Y * SEPARATION) / 2; // z

                scales[j] = 1;

                i += 3;
                j++;
            }
        }

        const geometry = new THREE.BufferGeometry();

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

        const material = new THREE.ShaderMaterial({
            uniforms: {
                color: { value: new THREE.Color(0x6380fb) },
            },
            vertexShader: `
        attribute float scale;
        void main() {
          vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
          gl_PointSize = scale * ( 300.0 / - mvPosition.z );
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
            fragmentShader: `
        uniform vec3 color;
        void main() {
          if ( length( gl_PointCoord - vec2( 0.5, 0.5 ) ) > 0.475 ) discard;
          gl_FragColor = vec4( color, 1.0 );
        }
      `,
        });

        const newParticles = new THREE.Points(geometry, material);

        newScene.add(newParticles);
        setParticles(newParticles);

        const newRenderer = new THREE.WebGLRenderer({ antialias: true });

        // newRenderer.setPixelRatio(window.devicePixelRatio);
        newRenderer.setSize(window.innerWidth, window.innerHeight);
        // newRenderer.setClearColor(0x0b1121, 1.0);
        threeRef.current.appendChild(newRenderer.domElement);
        setRenderer(newRenderer);
        animate();
    };

    const animate = () => {
        requestAnimationFrame(animate);
        render();
    };

    const render = () => {
        const newCamera = getCamera();
        const newScene = getScene();
        const newParticles = getParticles();
        const newRenderer = getRenderer();
        const count = getCount();

        if (!newCamera) return;

        newCamera.position.set(0, 500, 1000);

        const positions = newParticles.geometry.attributes.position.array;
        const scales = newParticles.geometry.attributes.scale.array;

        let i = 0,
            j = 0;

        for (let ix = 0; ix < AMOUNT_X; ix++) {
            for (let iy = 0; iy < AMOUNT_Y; iy++) {
                positions[i + 1] = Math.sin((ix + count) * 0.3) * 100 + Math.sin((iy + count) * 0.5) * 100;
                scales[j] = (Math.sin((ix + count) * 0.3) + 1) * 10 + (Math.sin((iy + count) * 0.5) + 1) * 10;
                i += 3;
                j++;
            }
        }

        newParticles.geometry.attributes.position.needsUpdate = true;
        newParticles.geometry.attributes.scale.needsUpdate = true;

        newRenderer.render(newScene, newCamera);

        // 调整波浪频率
        setCount((val) => (val += 0.01));
    };

    useEffect(() => {
        if (threeRef.current && !getCamera()) {
            init();
        }
    }, [threeRef]);

    useEffect(() => {
        svgCurve();
    }, [mousePosition]);

    const handleClick = () => {
        setExpoVal(!expoVal);
    }
    const handleMouseMove = (event) => {
        setMousePosition({x: event.clientX, y: event.clientY});
    };

    const easeOutExpo = (currentIteration, startValue, changeInValue, totalIteration) => {
        return changeInValue * (-Math.pow(2, -10 * currentIteration / totalIteration) + 1) + startValue;
    };

    const svgCurve = () => {
        if ((curX > mousePosition.x - 1) && (curX < mousePosition.x + 1)) {
            setXIteration(0);
            // xIteration = 0;
        } else {
            if (expoVal) {
                setTarX(0);
                // tarX = 0;
            } else {
                setXIteration(0);
                // xIteration = 0;
                if (mousePosition.x > hoverZone) {
                    setTarX(0);
                    // tarX = 0;
                } else {
                    setTarX(-(((60 + expandAmount) / 100) * (mousePosition.x - hoverZone)));
                    // tarX = -(((60 + expandAmount) / 100) * (mousePosition.x - hoverZone));
                }
            }
            setXIteration(xIteration + 1);
            // xIteration++;
        }

        if ((curY > mousePosition.y - 1) && (curY < mousePosition.y + 1)) {
            setYIteration(0);
            // yIteration = 0;
        } else {
            setYIteration(yIteration + 1);
            // yIteration++;
        }
        setCurX(easeOutExpo(xIteration, curX, tarX - curX, 100));
        setCurY(easeOutExpo(yIteration, curY, mousePosition.y - curY, 100));
        // curX = easeOutExpo(xIteration, curX, tarX - curX, 10);
        // curY = easeOutExpo(yIteration, curY, mousePosition.y - curY, 10);
        // console.log(curX, curY)
        let anchorDistance = 200;
        let curviness = anchorDistance - 40;
        let newCurve2 = "M60,"+height+"H0V0h60v"+(curY-anchorDistance)+"c0,"+curviness+","+curX+","+curviness+","+curX+","+anchorDistance+"S60,"+(curY)+",60,"+(curY+(anchorDistance*2))+"V"+height+"z";
        blobPath.current.setAttribute('d', newCurve2)
        blob.current.setAttribute('width', (curX + 70));
        if (!expoVal) {
            hamburger.current.style.cssText = `transform: translate(${curX}px, ${curY}px)`;
        } else {
            hamburger.current.style.cssText = `transform: translate(0px, 40px); transition: all 0.5s ease`;
        }
        window.requestAnimationFrame(svgCurve);
    }

    function Login(index) {
        if (index == 1) {
            message.success("正在前往QA扩散模型界面")
            window.location.href = "http://127.0.0.1:7860/?__theme=dark";
        } else {
            window.location.href = "https://u255460-9a75-59090378.westc.gpuhub.com:8443/"
        }
    }

    return (
        <div className={"svg-nav"}>
            <div id={"menu"} className={expoVal?"expanded":""} onMouseMove={handleMouseMove}>
                <div className={"hamburger"} ref={hamburger} onClick={handleClick}>
                    <div className={"line"}></div>
                    <div className={"line"}></div>
                    <div className={"line"}></div>
                </div>
                <div className={"menu-inner"}>
                    <div className={"nav-list"}>
                        {items.map((item, index) => (
                            <div key={index} className={"nav-link"} onClick={() => Login(index)}>
                                <FaUserAstronaut style={{width: "50%", height: "200px", zIndex: '4', marginLeft: "25px", color: "black"}}></FaUserAstronaut>
                                {expoVal && (<span style={{fontSize: '15px', zIndex: '4', color: "black", marginLeft: '25px'}}>{item}</span>)}
                            </div>
                        ))}
                    </div>
                </div>
                <svg id={"blob"} ref={blob}
                    version={"1.1"} xmlns={"http://www.w3.org/2000/svg"}
                    xmlnsXlink={"http://www.w3.org/1999/xlink"}>
                    <path id={"blob-path"} ref={blobPath}></path>
                </svg>
            </div>
            <div style={{backgroundColor: "#fff", height: window.innerHeight / 2, zIndex: '2', position: 'absolute', overflow: 'hidden'}}></div>
            <div style={{zIndex: '3', top: "30%", left: "50%", transform: "translate(-50%, -50%)", position: 'absolute', overflow: 'hidden', width: "900px"}}>
                <TypewriterText textToDisplay={"欢迎使用Qwen-AnimateDiff, 现在开启你的创作之旅吧！"} style={{color: 'white', fontSize: '50px'}}></TypewriterText>
            </div>
            <div style={{overflow: 'hidden', zIndex: '1', position: 'absolute'}} ref={threeRef}></div>
        </div>
    )
}

export default Index;