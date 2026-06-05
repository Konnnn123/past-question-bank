import fs from "fs";
import path from "path";
import https from "https";
import http from "http";

const MARKDOWN_DIR = path.resolve(__dirname, "../../markdown");
const OUTPUT_DIR = path.resolve(__dirname, "../public/past-exams");

// 匹配 Markdown 中的图片链接 ![...](https://...)
const IMAGE_REGEX = /!\[([^\]]*)\]\((https?:\/\/[^)]+)\)/g;

// 从 URL 中提取文件名，或生成唯一名
function getFileName(url: string, mdFileName: string): string {
  try {
    const urlObj = new URL(url);
    const ext = path.extname(urlObj.pathname) || ".jpg";
    // 用 MD 文件名前缀 + URL hash 防冲突
    const prefix = mdFileName
      .replace(/^MinerU_markdown_/, "")
      .replace(/_\d+$/, "")
      .replace(/\.md$/, "");
    const hash = path.basename(urlObj.pathname).replace(ext, "").slice(0, 12);
    return `${prefix}_${hash}${ext}`;
  } catch {
    return `${mdFileName}_${Date.now()}.jpg`;
  }
}

// 下载单个图片
function downloadImage(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;
    const request = (downloadUrl: string, redirectCount = 0) => {
      if (redirectCount > 5) {
        reject(new Error("Too many redirects"));
        return;
      }

      client
        .get(downloadUrl, (res) => {
          if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            request(res.headers.location, redirectCount + 1);
            return;
          }
          if (res.statusCode !== 200) {
            reject(new Error(`HTTP ${res.statusCode} for ${downloadUrl}`));
            return;
          }
          const fileStream = fs.createWriteStream(dest);
          res.pipe(fileStream);
          fileStream.on("finish", () => {
            fileStream.close();
            resolve();
          });
          fileStream.on("error", reject);
        })
        .on("error", reject);
    };
    request(url);
  });
}

async function main() {
  // 确保输出目录存在
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // 读取所有 .md 文件
  const mdFiles = fs.readdirSync(MARKDOWN_DIR).filter((f) => f.endsWith(".md"));
  console.log(`找到 ${mdFiles.length} 个 Markdown 文件\n`);

  let totalImages = 0;
  let downloaded = 0;
  let skipped = 0;
  let failed = 0;

  for (const mdFile of mdFiles) {
    const mdPath = path.join(MARKDOWN_DIR, mdFile);
    let content = fs.readFileSync(mdPath, "utf-8");

    // 提取所有图片链接
    const matches: { full: string; alt: string; url: string }[] = [];
    let match;
    while ((match = IMAGE_REGEX.exec(content)) !== null) {
      matches.push({ full: match[0], alt: match[1], url: match[2] });
    }
    IMAGE_REGEX.lastIndex = 0; // 重置正则

    if (matches.length === 0) {
      console.log(`⏭  ${mdFile}: 无图片`);
      continue;
    }

    console.log(`📄 ${mdFile}: ${matches.length} 张图片`);
    totalImages += matches.length;

    for (const { full, url } of matches) {
      const fileName = getFileName(url, mdFile);
      const destPath = path.join(OUTPUT_DIR, fileName);
      const localPath = `/past-exams/${fileName}`;

      // 如果已下载过，跳过
      if (fs.existsSync(destPath)) {
        console.log(`  ⏭  已存在: ${fileName}`);
        skipped++;
      } else {
        try {
          await downloadImage(url, destPath);
          console.log(`  ✅ 下载: ${fileName}`);
          downloaded++;
        } catch (err: any) {
          console.error(`  ❌ 失败: ${fileName} - ${err.message}`);
          failed++;
          continue;
        }
      }

      // 替换 MD 文件中的链接
      const localRef = `![${full.match(/!\[([^\]]*)\]/)?.[1] || "image"}](${localPath})`;
      content = content.replace(full, localRef);
    }

    // 保存修改后的 MD 文件
    fs.writeFileSync(mdPath, content, "utf-8");
    console.log(`  💾 已更新: ${mdFile}\n`);
  }

  console.log("═══════════════════════════════");
  console.log(`总计: ${totalImages} 张图片`);
  console.log(`下载: ${downloaded} 张`);
  console.log(`跳过: ${skipped} 张 (已存在)`);
  console.log(`失败: ${failed} 张`);
  console.log("═══════════════════════════════");
}

main().catch(console.error);
