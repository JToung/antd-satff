import moment from 'moment';
import React from 'react';
import nzh from 'nzh/cn';
import { parse, stringify } from 'qs';
import cookie from 'universal-cookie'



/**
 * 封装获取 cookie 的方法
 */
export default function getCookie(name){
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg))
    return unescape(arr[2]);
    else
    return null;
}

export function delInvalidData({ query1, value1, query2, value2, queryTime, time, dataTime, ...params }) {
	let formValues = {
		...params,
		[query1]: value1,
		[query2]: value2,
		[queryTime]: time ? `${time[0]}|${time[1]}` : dataTime ? `${dataTime[0]}|${dataTime[1]}` : null
	};

	Object.keys(formValues).map((item) => (!formValues[item] || item === 'undefined') && delete formValues[item]);
	return formValues;
}
/**
 * 转换以post方式提交的数据
 *
 * @param params
 * @returns {string}
 */
export function changeParams(params) {
	let paramStr = '';
	for (let key in params) {
		if (params.hasOwnProperty(key)) paramStr += key + '=' + params[key] + '&';
	}
	return paramStr.substring(0, paramStr.lastIndexOf('&'));
}

/**
   * 转换以get方式提交的数据
   *
   * @param params
   * @returns {string}
   */
export function changeGetParams(params) {
	let paramStr = '';
	for (let key in params) {
		if (params.hasOwnProperty(key)) paramStr += '/' + params[key];
	}
	return paramStr;
}

export function fixedZero(val) {
	return val * 1 < 10 ? `0${val}` : val;
}

export function getTimeDistance(type) {
	const now = new Date();
	const oneDay = 1000 * 60 * 60 * 24;

	if (type === 'today') {
		now.setHours(0);
		now.setMinutes(0);
		now.setSeconds(0);
		return [ moment(now), moment(now.getTime() + (oneDay - 1000)) ];
	}

	if (type === 'week') {
		let day = now.getDay();
		now.setHours(0);
		now.setMinutes(0);
		now.setSeconds(0);

		if (day === 0) {
			day = 6;
		} else {
			day -= 1;
		}

		const beginTime = now.getTime() - day * oneDay;

		return [ moment(beginTime), moment(beginTime + (7 * oneDay - 1000)) ];
	}

	if (type === 'month') {
		const year = now.getFullYear();
		const month = now.getMonth();
		const nextDate = moment(now).add(1, 'months');
		const nextYear = nextDate.year();
		const nextMonth = nextDate.month();

		return [
			moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`),
			moment(moment(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000)
		];
	}

	const year = now.getFullYear();
	return [ moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`) ];
}

export function getPlainNode(nodeList, parentPath = '') {
	const arr = [];
	nodeList.forEach((node) => {
		const item = node;
		item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
		item.exact = true;
		if (item.children && !item.component) {
			arr.push(...getPlainNode(item.children, item.path));
		} else {
			if (item.children && item.component) {
				item.exact = false;
			}
			arr.push(item);
		}
	});
	return arr;
}

export function digitUppercase(n) {
	return nzh.toMoney(n);
}

/**
 * 获取窗口滚动位置
 * @returns {number}
 */
export function getScrollTop() {
	return document.body.scrollTop || document.documentElement.scrollTop || window.pageYOffset;
}

export function setScrollTop() {
	const scrollTop = sessionStorage.getItem('scrollTop');
	window.scrollTo(0, Number(scrollTop));
	sessionStorage.removeItem('scrollTop');
}

function getRelation(str1, str2) {
	if (str1 === str2) {
		console.warn('Two path are equal!'); // eslint-disable-line
	}
	const arr1 = str1.split('/');
	const arr2 = str2.split('/');
	if (arr2.every((item, index) => item === arr1[index])) {
		return 1;
	}
	if (arr1.every((item, index) => item === arr2[index])) {
		return 2;
	}
	return 3;
}

function getRenderArr(routes) {
	let renderArr = [];
	renderArr.push(routes[0]);
	for (let i = 1; i < routes.length; i += 1) {
		// 去重
		renderArr = renderArr.filter((item) => getRelation(item, routes[i]) !== 1);
		// 是否包含
		const isAdd = renderArr.every((item) => getRelation(item, routes[i]) === 3);
		if (isAdd) {
			renderArr.push(routes[i]);
		}
	}
	return renderArr;
}

/**
 * Get router routing configuration
 * { path:{name,...param}}=>Array<{name,path ...param}>
 * @param {string} path
 * @param {routerData} routerData
 */
export function getRoutes(path, routerData) {
	let routes = Object.keys(routerData).filter((routePath) => routePath.indexOf(path) === 0 && routePath !== path);
	// Replace path to '' eg. path='user' /user/name => name
	routes = routes.map((item) => item.replace(path, ''));
	// Get the route to be rendered to remove the deep rendering
	const renderArr = getRenderArr(routes);
	// Conversion and stitching parameters
	const renderRoutes = renderArr.map((item) => {
		const exact = !routes.some((route) => route !== item && getRelation(route, item) === 1);
		return {
			exact,
			...routerData[`${path}${item}`],
			key: `${path}${item}`,
			path: `${path}${item}`
		};
	});
	return renderRoutes;
}

export function getPageQuery() {
	return parse(window.location.href.split('?')[1]);
}

export function getQueryPath(path = '', query = {}) {
	const search = stringify(query);
	if (search.length) {
		return `${path}?${search}`;
	}
	return path;
}

/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export function isUrl(path) {
	return reg.test(path);
}

export function formatWan(val) {
	const v = val * 1;
	if (!v) return '';

	let result = val;
	if (val > 10000) {
		result = Math.floor(val / 10000);
		result = (
			<span>
				{result}
				<span
					style={{
						position: 'relative',
						top: -2,
						fontSize: 14,
						fontStyle: 'normal',
						marginLeft: 2
					}}
				>
					万
				</span>
			</span>
		);
	}
	return result;
}

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export function isAntdPro() {
	return window.location.hostname === 'preview.pro.ant.design';
}

export const importCDN = (url, name) =>
	new Promise((resolve) => {
		const dom = document.createElement('script');
		dom.src = url;
		dom.type = 'text/javascript';
		dom.onload = () => {
			resolve(window[name]);
		};
		document.head.appendChild(dom);
	});

/**
 * 身份证校验
 * @param {*} rule 
 * @param {身份证号} code 
 * @param {*} callback 
 */
export function IdCodeValid(rule, code, callback) {
	//身份证号合法性验证
	//支持15位和18位身份证号
	//支持地址编码、出生日期、校验位验证
	var city = {
		11: '北京',
		12: '天津',
		13: '河北',
		14: '山西',
		15: '内蒙古',
		21: '辽宁',
		22: '吉林',
		23: '黑龙江 ',
		31: '上海',
		32: '江苏',
		33: '浙江',
		34: '安徽',
		35: '福建',
		36: '江西',
		37: '山东',
		41: '河南',
		42: '湖北 ',
		43: '湖南',
		44: '广东',
		45: '广西',
		46: '海南',
		50: '重庆',
		51: '四川',
		52: '贵州',
		53: '云南',
		54: '西藏 ',
		61: '陕西',
		62: '甘肃',
		63: '青海',
		64: '宁夏',
		65: '新疆',
		71: '台湾',
		81: '香港',
		82: '澳门',
		91: '国外 '
	};
	if (!city[code.substr(0, 2)]) {
		callback('身份证号地址编码错误');
	} else if (!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|[xX])$/.test(code)) {
		callback('身份证号格式错误');
	} else {
		//18位身份证需要验证最后一位校验位
		if (code.length == 18) {
			code = code.split('');
			//∑(ai×Wi)(mod 11)
			//加权因子
			var factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
			//校验位
			var parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
			var sum = 0;
			for (var i = 0; i < 17; i++) {
				sum += code[i] * factor[i];
			}
			if (parity[sum % 11] != code[17]) {
				callback('身份证号校验位错误，请检查重新输入');
			}
		}
	}
	callback();
}

/**
 * 生成验证码
*/

export const CreateCode = () => {
	const ctx = this.canvas.getContext('2d')
	const chars = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
	let code = ''
	ctx.clearRect(0, 0, 80, 40)
	for (let i = 0; i < 4; i++) {
		const char = chars[randomNum(0, 57)]
		code += char
		ctx.font = randomNum(20, 25) + 'px SimHei'  //设置字体随机大小
		ctx.fillStyle = '#D3D7F7'
		ctx.textBaseline = 'middle'
		ctx.shadowOffsetX = randomNum(-3, 3)
		ctx.shadowOffsetY = randomNum(-3, 3)
		ctx.shadowBlur = randomNum(-3, 3)
		ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'
		let x = 80 / 5 * (i + 1)
		let y = 40 / 2
		let deg = randomNum(-25, 25)
		/**设置旋转角度和坐标原点**/
		ctx.translate(x, y)
		ctx.rotate(deg * Math.PI / 180)
		ctx.fillText(char, 0, 0)
		/**恢复旋转角度和坐标原点**/
		ctx.rotate(-deg * Math.PI / 180)
		ctx.translate(-x, -y)
	}
	this.setState({
		code
	})
}