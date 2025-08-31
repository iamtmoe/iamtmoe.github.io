const fs = require("fs");
const path = require("path");

// 获取命令行参数
const args = process.argv.slice(2);
if (args.length < 1) {
  console.error("用法: npm run gen <type> [name]");
  console.error("示例: npm run gen post [标题]");
  console.error("示例: npm run gen poem 诗词名");
  process.exit(1);
}

const [type, name] = args;

// 获取当前日期
const now = new Date();
const year = now.getFullYear();
const month = String(now.getMonth() + 1).padStart(2, "0");
const day = String(now.getDate()).padStart(2, "0");

// 根据类型生成不同的模板
let template = "";
let fileName = "";
let dirPath = "";

if (type === "poem") {
  // 诗词模板
  if (!name) {
    console.error("创建诗词必须指定名称");
    process.exit(1);
  }
  template = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="keyword" content="一何有尔 一何 poems" />
    <meta name="description" content="一何有尔的诗词 - ${name}" />
    <title>${name} - 一何有尔</title>
    <link rel="stylesheet" href="/common.css" />
  </head>
  <body>
    <main>
      <div class="back-home">
        <a href="/poems/index.html">← 返回诗词列表</a>
      </div>
      <h1>${name}</h1>
      <sub class="time">[${year}年${month}月${day}日]</sub>
      <div class="content">
        <pre>
在此处输入诗词内容
        </pre>
      </div>
      <div class="comment">
        <div>注释&赏析：</div>
        <p>
          在此处输入注释和赏析
        </p>
      </div>
    </main>
  </body>
</html>`;
  fileName = `${name}.html`;
  dirPath = "poems";

  // 更新诗词列表
  const indexPath = path.join(dirPath, "index.html");
  if (fs.existsSync(indexPath)) {
    let indexContent = fs.readFileSync(indexPath, "utf8");
    const newEntry = `        <li>\n          <a href="/poems/${fileName}">${name}</a>\n        </li>`;

    // 在第一个 <li> 标签前插入新诗词
    const insertPos = indexContent.indexOf("        <li>");
    if (insertPos !== -1) {
      indexContent =
        indexContent.slice(0, insertPos) +
        newEntry +
        "\n" +
        indexContent.slice(insertPos);
      fs.writeFileSync(indexPath, indexContent);
      console.log(`已更新诗词列表：${indexPath}`);
    }
  }
} else if (type === "post") {
  // 博客文章模板
  const title = name || `${year}${month}${day}`;
  template = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="keyword" content="一何有尔 一何 blog" />
    <meta name="description" content="一何有尔的博客 - ${title}" />
    <title>${title} - 一何有尔</title>
    <link rel="stylesheet" href="/common.css" />
  </head>
  <body>
    <main>
      <div class="back-home">
        <a href="/posts/index.html">← 返回日记列表</a>
      </div>
      <h1>${title}</h1>
      <sub class="time">${year}${month}${day}</sub>
      <div class="content">
        <p>
          在此处输入文章内容
        </p>
      </div>
    </main>
  </body>
</html>`;
  fileName = `${year}${month}${day}.html`;
  dirPath = "posts";

  // 更新文章列表
  const indexPath = path.join(dirPath, "index.html");
  if (fs.existsSync(indexPath)) {
    let indexContent = fs.readFileSync(indexPath, "utf8");
    const dateStr = `${year}/${month}/${day}`;
    const newEntry = `        <li>\n          <a href="/posts/${fileName}">${dateStr}</a>\n        </li>`;

    // 在第一个 <li> 标签前插入新文章
    const insertPos = indexContent.indexOf("        <li>");
    if (insertPos !== -1) {
      indexContent =
        indexContent.slice(0, insertPos) +
        newEntry +
        "\n" +
        indexContent.slice(insertPos);
      fs.writeFileSync(indexPath, indexContent);
      console.log(`已更新文章列表：${indexPath}`);
    }
  }
} else {
  console.error("不支持的类型，请使用 post 或 poem");
  process.exit(1);
}

// 创建目录（如果不存在）
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath, { recursive: true });
}

// 写入文件
const filePath = path.join(dirPath, fileName);
fs.writeFileSync(filePath, template);

console.log(`已创建文件：${filePath}`);
