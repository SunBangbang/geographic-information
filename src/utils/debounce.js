/*
 * @Description: 函数防抖
 * @version: 
 * @Author: Chen JianXin
 * @Date: 2020-12-28 09:33:43
 * @LastEditors: Chen JianXin
 * @LastEditTime: 2020-12-28 10:15:16
 */

/**
* @desc 函数防抖---“立即执行版本” 和 “非立即执行版本” 的组合版本
* @param func 需要执行的函数
* @param wait 延迟执行时间（毫秒）
* @param immediate---true 表立即执行，false 表非立即执行
**/
export default function debounce(func,wait,immediate) {
    let timer;
    return function () {
        let context = this;
        let args = arguments;
        if (timer) clearTimeout(timer);
        if (immediate) {
            var callNow = !timer;
            timer = setTimeout(() => {
                timer = null;
            }, wait)
            if (callNow) func.apply(context, args)
        } else {
                timer = setTimeout(function(){
                    func.apply(context, args)
                }, wait);
            }
    }
}
    
    // function handle(){
    //     console.log(Math.random());
    // }
    
    //window.addEventListener("mousemove",debounce(handle,1000,true)); // 调用立即执行版本
    //window.addEventListener("mousemove",debounce(handle,1000,false)); // 调用非立即执行版本
