import './calculator.css';
import { btns, BTN_ACTIONS } from './btnConfig';
import React, { useRef, useEffect, useState } from 'react';
import pic1 from "../../delete.png";
import pic2 from "../../delete2.png";

const Calculator = () => {

    const btnsRef = useRef(null);
    const expRef = useRef(null);

    const [expression, setExpression] = useState('');

    useEffect(() => {
        const btns = Array.from(btnsRef.current.querySelectorAll('button'));
        btns.forEach(e => e.style.height = e.offsetWidth + 'px');
    }, []);

    const changeTheme = () => {
        document.body.classList.toggle('dark');
        let tombol = document.querySelectorAll('.btn__op2');
        tombol.forEach(tombol => {
            tombol.classList.toggle('btn__op2__dark');
          });

        tombol = document.querySelectorAll('.btn__op3');
        tombol.forEach(tombol => {
            tombol.classList.toggle('btn__op3__dark');
          });

        document.querySelector('.ribbon').classList.toggle('ribbon__dark');
        document.querySelector('.label').classList.toggle('label__dark');

        document.querySelector('.gambarDel').src == pic1 ?
        document.querySelector('.gambarDel').src = pic2 :
        document.querySelector('.gambarDel').src = pic1
    }

    const btnClick = (item) => {
        const expDiv = expRef.current;

        if (item.action === BTN_ACTIONS.ADD) {
            addAnimSpan(item.display);
            const oper = item.display !== 'x' ? item.display : '*';
            setExpression(expression + oper);
        }

        if (item.action === BTN_ACTIONS.DELETE) {
            if (expression.length == 1){
                expDiv.parentNode.querySelector('div:last-child').innerHTML = '';
                expDiv.innerHTML = '';
                setExpression('');
            } else if (expression !== ""){
                deleteBtn();
                setExpression(expression.slice(0, -1));
            }
        }
        if (item.action === BTN_ACTIONS.CONVERT) {
            if (expression.charAt(0) === "-") {
                setExpression(expression.substring(1));
                convertToPlus();
              } else if (expression !== "") {
                setExpression("-" + expression);
                convertToMinus();
              }
        }

        if (item.action === BTN_ACTIONS.CLEAR) {
            expDiv.parentNode.querySelector('div:last-child').innerHTML = '';
            expDiv.innerHTML = '';

            setExpression('');
        }

        if (item.action === BTN_ACTIONS.CALC) {
            if (expression.trim().length <= 0) return;

            expDiv.parentNode.querySelector('div:last-child').remove();

            expDiv.innerHTML = thousandSeperator(expression).replace("*", "x");

            const cloneNode = expDiv.cloneNode(true);
            expDiv.parentNode.appendChild(cloneNode);

            const transform = `translateY(${-(expDiv.offsetHeight + 10) + 'px'}) scale(0.4)`;

            try {
                let res = eval(expression);

                setExpression(res.toString());
                setTimeout(() => {
                    cloneNode.style.transform = transform;
                    expDiv.innerHTML = '';

                    String(res).length > 9 ?
                    
                    addAnimSpan(thousandSeperator(parseFloat(res).toFixed(3))) : 
                    addAnimSpan(thousandSeperator(res));
                }, 200);
            } catch {
                setTimeout(() => {
                    cloneNode.style.transform = transform;
                    cloneNode.innerHTML = 'Kesalahan';
                }, 200);
            } finally {
                console.log('calc complete');
            }
        }
    }

    const thousandSeperator = (x) => {
        return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    }
    
    const addAnimSpan = (content) => {
        const expDiv = expRef.current;
        const span = document.createElement('span');

        span.innerHTML = content;
        span.style.opacity = '0';
        expDiv.appendChild(span);

        const width = span.offsetWidth + 'px';
        span.style.width = '0';

        setTimeout(() => {
            span.style.opacity = '1';
            span.style.width = width;
        }, 100);
    }

    const convertToMinus = () => {
        const expDiv = expRef.current;
        const span = document.createElement('span');

        span.innerHTML = "-";
        span.style.opacity = '0';
        expDiv.prepend(span);

        const width = span.offsetWidth + 'px';
        span.style.width = '0';

        setTimeout(() => {
            span.style.opacity = '1';
            span.style.width = width;
        }, 0);
    }

    const convertToPlus = () => {
        const expDiv = expRef.current;

        if (!expDiv.children[1]){
            expDiv.firstChild.innerHTML = + expDiv.firstChild.innerHTML.substring(1);
        } else {
            expDiv.removeChild(expDiv.firstChild);
        }
    }

    const deleteBtn = () => {
        const expDiv = expRef.current;
        console.log(expDiv);
        if (!expDiv.children[1]){
            expDiv.firstChild.innerHTML = + expDiv.firstChild.innerHTML.slice(0, -1);
        } else {
            expDiv.removeChild(expDiv.lastChild);
        }
        
    }
    
    return (
        <div className="calculator">
            {/* <======= Bagian Ribbon =======> */}
            <span className='ribbon'></span>


            {/* <======= Bagian Toggle =======> */}
            <div className='calculator__toggle'>
                <input type="checkbox" className="checkbox" id="chk" onClick={changeTheme} />
                <label className="label" htmlFor="chk">
                    <span className="fas fa-moon">🌙</span>
                    <span className="fas fa-sun">☀️</span>
                    <div className="ball"></div>
                </label>
            </div>

            {/* <======= Bagian Layar =======> */}
            <div className="calculator__result">
                <div ref={expRef} className="calculator__result__exp"></div>
                <div className="calculator__result__exp"></div>
            </div>

            {/* <======= Bagian Tombol =======> */}
            <div ref={btnsRef} className="calculator__btns">
                {
                    btns.map((item, index) => (
                        <button
                            className={item.class}
                            onClick={() => btnClick(item)}
                        >
                            {item.display == 'DEL' ? <img className='gambarDel' src={pic2} alt="DEL" /> : item.display}
                        </button>
                    ))
                }
            </div>

        </div>
    );
}

export default Calculator;
