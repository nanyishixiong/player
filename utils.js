const fs = require("fs");
const path = require("path");

const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout
});

// let baseUrl = process.cwd();
// console.log(baseUrl);
let baseUrl = "C:\\Users\\15439\\Documents\\react18";
let outputFileName = "";
let serverUrl = "http://127.0.0.1:8081/video";

// 取出文件夹中所有mp4文件的绝对路径
function getPath(targetUrl) {
  // 文件不存在直接返回
  if (!fs.existsSync(targetUrl)) return [];
  const result = [];
  // 返回文件列表
  const files = fs.readdirSync(targetUrl);

  // 抛弃数组后三个
  // files.splice(files.length - 3, 3);

  for (let i = 0; i < files.length; i++) {
    const fileName = files[i]; // 文件名
    // 完整路径
    const filedir = path.join(targetUrl, fileName);
    // 取到文件对象 判断是文件还是文件夹
    const stat = fs.statSync(filedir);
    const isFile = stat.isFile();
    const isDirectory = stat.isDirectory();

    // 是文件处理逻辑 && 只取 mp4 类型文件
    if (isFile && fileName.endsWith(".mp4")) {
      // '[1.1.3.2]--3-2以架构师的思维分析需求_【一手好课+vx：jmk868568].mp4'
      // 去掉中间的广告 【一手好课+vx：jmk868568]
      const regStrs = /(【.*).mp4/.exec(fileName);
      let label = fileName;
      if (regStrs) {
        label = fileName.replace(regStrs[1], "");
      }
      result.push({
        label,
        url: filedir.replace(baseUrl, serverUrl) // C:\\Users\\15439\\Documents\\前端架构\\something.mp4" => http://127.0.0.1:8081/vedio/something.mp4"
      });
    }

    // 是文件夹处理逻辑
    if (isDirectory) {
      result.push(...getPath(filedir));
    }
  }

  return result;
}

function output() {
  // 取到数组转字符串
  const allPaths = getPath(baseUrl);
  const result = JSON.stringify(allPaths);

  // 写入文件
  fs.writeFileSync(outputFileName, result);
  /**
   * result.js 数据结构
   * export default [
   *  {
   *    label: '第四课',
   *    url: 'xxxx',
   *  }
   * ]
   */

  console.log("————成功————");
}

readline.question(`请输入文件夹（C:\\Users\\15439\\Documents）：`, (dir) => {
  if (dir) {
    baseUrl = `C:\\Users\\15439\\Documents\\${dir}`;
  }
  console.log(`读取文件目录：${baseUrl}`);
  readline.question(`请输入输出文件名：`, (filename) => {
    if (filename === "") {
      filename = "result";
    }
    outputFileName = `./public/${filename}.json`;
    console.log(`输出文件: ${outputFileName}`);
    // 输出
    output();
    readline.close();
  });
});
