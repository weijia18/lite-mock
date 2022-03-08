const numberRandom = (min: number = 1, max: number = 100) => {
    var Range = max - min;
    var Rand = Math.random();
    return (min + Math.round(Rand * Range));
};

const stringRandom = (num: number = 10) => {
    let arr = []
    for (let i = 0; i < num; i++) {
        let str
        //汉字对应的unicode编码为u4e00-u9fa5转为10进制为19968-40869，先取随机数，再转为16进制
        str = '\\u' + (Math.floor(Math.random() * (40869 - 19968)) + 19968).toString(16)
        //在用正则操作数据后进行解码。注意：unescape() 函数在 JavaScript 1.5 版中已弃用。请使用 decodeURI() 或 decodeURIComponent() 代替。
        str = unescape(str.replace(/\\u/g, "%u"));
        arr.push(str)
    }
    let chinese = arr.join("")
    return chinese
}
export {
    numberRandom,
    stringRandom
}
