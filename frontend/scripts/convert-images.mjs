import sharp from "sharp";
import { promises as fs } from "fs";

const tasks = [
  // HERO (w ~2200)
  { in: "public/hero.png",   out: "public/hero",   width: 2200 },
  { in: "public/test4.png",  out: "public/test4",  width: 2200 },
  { in: "public/hero3.png",  out: "public/hero3",  width: 2200 },
  // hero12/hero13 
  { in: "public/hero12.png", out: "public/hero12", width: 2200 },
  { in: "public/hero13.png", out: "public/hero13", width: 2200 },

  // STORY (w ~1200)
  { in: "public/ourStory/story1.png", out: "public/ourStory/story1", width: 1200 },
  { in: "public/ourStory/story2.png", out: "public/ourStory/story2", width: 1200 },
  { in: "public/ourStory/story3.png", out: "public/ourStory/story3", width: 1200 },
];

for (const t of tasks) {
  try {
    await fs.stat(t.in);
  } catch {
    console.log("skip (no file):", t.in);
    continue;
  }
  await sharp(t.in).resize({ width: t.width, withoutEnlargement: true })
    .toFormat("webp", { quality: 80 }).toFile(`${t.out}.webp`);
  await sharp(t.in).resize({ width: t.width, withoutEnlargement: true })
    .toFormat("avif", { quality: 45 }).toFile(`${t.out}.avif`);
  console.log("Converted:", t.in);
}
