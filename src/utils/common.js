import { document, window } from 'global';
import { message } from 'antd';
import { fromJS } from 'immutable';

export const getUrlParameter = (urlSearch) => {
    if (!urlSearch) return null;

    const obj = {};
    urlSearch.substr(1).split('&').map((x) => {
        const temp = x.split('=');
        if (temp.length === 2) {
            obj[temp[0]] = temp[1];
        }
    });
    return obj;
};

export const px2Number = (text) => {
    const number = text.substring(0, text.length - 2);
    return Number(number);
};

export const uploadImg = (event, params, callback) => {
    const file = event.files ? event.files[0] : null;
    const { accept = 'image/gif,image/jpeg,,image/jpg,image/png', errorMsg = '请上传png、jpg、gif格式的图片', maxSize = '500K', type } = params
    if (file) {
        if (file.type && accept.indexOf(file.type) === -1) {
            event.value = '';
            message.error(errorMsg, 2);
            return;
        }

        if (file.size > parseFloat(maxSize.indexOf('K') > -1 ? maxSize : (parseFloat(maxSize) * 1024)) * 1024) {
            event.value = '';
            message.error(`请上传小于${maxSize}的文件`, 2);
            return;
        }

        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = (e) => {
            if (file.type.indexOf('image') > -1) {
                const img = new Image();
                img.src = e.target.result;
                img.onload = () => {
                    const width = img.width;
                    const height = img.height;
                    event.value = '';
                    return callback({ value: e.target.result }, type, width, height);
                };
            } else {
                // 有些（不靠谱的）游览器没有file type
                if (!file.type && accept) {
                    const fileValidation = accept.split(',').some((val) => {
                        return e.target.result.indexOf(val) > -1;
                    });
                    if (!fileValidation) {
                        message.error(errorMsg, 2);
                        return;
                    }
                }
                event.value = '';
                return callback({ value: e.target.result, fileName: file.name }, type);
            }
        };
    }
};

// 处理 boxShadow
export const handleBoxShadow = (prepBoxShadowStyle, styleType, value) => {
    let shadowStyle = '';
    let shadowStyleArray = [];
    shadowStyle = prepBoxShadowStyle || 'transparent 0 0 0 0';
    shadowStyleArray = shadowStyle.split(' ');
    let arrayXY = [];
    let arrayColor = [];
    let arrayInset = [];
    if (shadowStyleArray[shadowStyleArray.length - 1] !== 'inset') {
        arrayXY = shadowStyleArray.slice(-4);
        arrayColor = shadowStyleArray.slice(0, shadowStyleArray.length - 4);
        arrayInset = [];
    } else {
        arrayXY = shadowStyleArray.slice(shadowStyleArray.length - 5, shadowStyleArray.length - 1);
        arrayColor = shadowStyleArray.slice(0, shadowStyleArray.length - 5);
        arrayInset = shadowStyleArray.slice(-1);
    }

    switch (styleType) {
        case 'boxShadowX':
            arrayXY[0] = `${value}px`;
            break;
        case 'boxShadowY':
            arrayXY[1] = `${value}px`;
            break;
        case 'boxShadowClarity':
            arrayXY[2] = `${value}px`;
            break;
        case 'boxShadowSize':
            arrayXY[3] = `${value}px`;
            break;
        case 'boxShadowColor':
            arrayColor = value.split(' ');
            break;
        case 'boxShadowType':
            arrayInset[0] = value;
            break;
    }
    if (arrayInset[0] === '') {
        shadowStyle = arrayColor.concat(arrayXY).join(' ');
    } else {
        shadowStyle = arrayColor.concat(arrayXY).concat(arrayInset).join(' ');
    }
    return shadowStyle;
};

// 处理 带'-'的style
export const handleCSS = (style) => {
    if (style.includes('-')) {
        const be = style.split('-')[1];
        const beArray = Array.from(be);
        beArray[0] = beArray[0].toUpperCase();
        return `${style.split('-')[0]}${beArray.join('')}`;
    } else {
        return style;
    }
};

// RGB 转16进制
export const rgbToHex = (rgb) => {
    // rgb(x, y, z)
    const color = rgb.toString().match(/\d+/g); // 把 x,y,z 推送到 color 数组里
    let alpha;
    if (color.length > 3) {
        alpha = color[3] * 100;
    } else {
        alpha = 100;
    }
    let hex = '#';
    for (let i = 0; i < 3; i++) {
        // 'Number.toString(16)' 是JS默认能实现转换成16进制数的方法.
        // 'color[i]' 是数组，要转换成字符串.
        // 如果结果是一位数，就在前面补零。例如： A变成0A
        hex += (`0${Number(color[i]).toString(16)}`).slice(-2);
    }
    return { hex, alpha };
};

// 能处理 #axbycz 或 #abc 形式
export const hexToRgb = (hex, alpha) => {
    const sColor = hex.toLowerCase();
    if (sColor) {
        const sColorChange = [];
        for (let i = 1; i < 7; i += 2) {
            // sColorChange.push(parseInt('0x'+sColor.slice(i, i + 2)));
            sColorChange.push(parseInt(`0x${sColor.slice(i, i + 2)}`));
        }
        // return "RGB(" + sColorChange.join(",") + ")";
        return `rgba(${sColorChange.join(',')},${alpha >= 0 ? alpha / 100 : 1})`;
    }
};

// 获取中心点和鼠标坐标连线，与y轴正半轴之间的夹角
// px py 为中心点， mx my为鼠标坐标
export const getAngle = (px, py, mx, my) => {
    const x = Math.abs(px - mx);
    const y = Math.abs(py - my);
    const z = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    const cos = y / z;
    const radina = Math.acos(cos);// 用反三角函数求弧度
    let angle = Math.floor(180 / (Math.PI / radina));// 将弧度转换成角度

    if (mx > px && my > py) { // 鼠标在第四象限
        angle = 180 - angle;
    }
    if (mx === px && my > py) { // 鼠标在y轴负方向上
        angle = 180;
    }
    if (mx > px && my === py) { // 鼠标在x轴正方向上
        angle = 90;
    }
    if (mx < px && my > py) { // 鼠标在第三象限
        angle = 180 + angle;
    }
    if (mx < px && my === py) { // 鼠标在x轴负方向
        angle = 270;
    }
    if (mx < px && my < py) { // 鼠标在第二象限
        angle = 360 - angle;
    }
    return angle;
};

export const selectText = (containerid) => {
    if (document.selection) {
        const range = document.body.createTextRange();
        range.moveToElementText(document.getElementById(containerid));
        range.select();
    } else if (window.getSelection) {
        const range = document.createRange();
        range.selectNodeContents(document.getElementById(containerid));
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
    }
};

/**
 * 深拷贝修改Object
 * key为数组 按照层次结构顺序排列
*/
// export const updateObject = (obj, key, val) => {
//   const copy = 
// };