/**
 * Structural extractor: derives a UI-structure description from saved
 * local-only HTML snapshots (no new network requests).
 *
 * Reads:  reference-private/wecare/html/*.html (+ pages-raw.json for rep picks)
 * Writes: reference-private/wecare/metadata/structure.json (LOCAL-ONLY, git-ignored)
 *         + a console evidence summary used to author docs/reference/*.md
 *
 * Extracts structure (element counts, labels, control names) — never copies
 * source code, copy, images, or branding into tracked files.
 *
 * Usage: tsx scripts/reference/analyze.ts [--extra=<url> --label=<label> ...]
 */
import * as fs from "node:fs";
import * as path from "node:path";
import * as cheerio from "cheerio";
import { filenameForUrl } from "./urls.js";
import type { PageRecord } from "./types.js";

const projectRoot = process.cwd();
const htmlDir = path.join(projectRoot, "reference-private", "wecare", "html");
const metaDir = path.join(projectRoot, "reference-private", "wecare", "metadata");

const text = (el: { text: () => string }): string =>
  el.text().trim().replace(/\s+/g, " ");

function topNav($: cheerio.CheerioAPI): Array<{ label: string; href: string }> {
  const out: Array<{ label: string; href: string }> = [];
  const nav = $("header nav").first().length > 0 ? $("header nav").first() : $("nav").first();
  nav.find("a").each((_, a) => {
    const label = text($(a)).slice(0, 60);
    const href = ($(a).attr("href") ?? "").slice(0, 200);
    if (label && out.length < 30) out.push({ label, href });
  });
  return out;
}

function footerColumns($: cheerio.CheerioAPI): Array<{ heading: string; links: string[] }> {
  const cols: Array<{ heading: string; links: string[] }> = [];
  // The site uses div-based collapsible columns (.footer-mod-col-title), not h-tags.
  $("footer .footer-mod-col, footer [class*=footer-col], footer .row > div").each((_, col) => {
    const heading = text($(col).find(".footer-mod-col-title, h1, h2, h3, h4, strong").first()).slice(0, 80);
    const links: string[] = [];
    $(col).find("a").each((_, a) => {
      const t = text($(a)).slice(0, 60);
      if (t && links.length < 20) links.push(t);
    });
    if ((heading || links.length > 0) && cols.length < 12) cols.push({ heading, links });
  });
  return cols;
}

function extractHeader($: cheerio.CheerioAPI): Record<string, unknown> {
  const header = $("header").first();
  const topbarLinks: string[] = [];
  header.find(".topbar a, [class*=top-bar] a, [class*=announcement] a, .header-top a").each((_, a) => {
    const t = text($(a)).slice(0, 60);
    if (t && topbarLinks.length < 15) topbarLinks.push(t);
  });
  const logoImg = header.find("img").first();
  const searchInput = header.find('input[type=search], input[name*=search i], input[placeholder]').first();
  const ctrls: Array<{ kind: string; label: string; href: string }> = [];
  header.find("a, button").each((_, el) => {
    const t = (text($(el)) + " " + ($(el).attr("aria-label") ?? "")).trim().slice(0, 60);
    const foldedCtrl = t.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const href = ($(el).attr("href") ?? "").slice(0, 160);
    if (/καλαθ|kalath|cart|basket|αγορ|agor/i.test(foldedCtrl)) ctrls.push({ kind: "cart", label: t, href });
    else if (/agap|wishlist|favor/i.test(foldedCtrl)) ctrls.push({ kind: "wishlist", label: t, href });
    else if (/login|sign|account|λογαρ|συνδ/i.test(foldedCtrl)) ctrls.push({ kind: "account", label: t, href });
    if (ctrls.length >= 12) return false;
  });
  // Mega menu: top-level items that expand into multi-column panels.
  const megaItems: Array<{ label: string; panelLinks: number; columns: number }> = [];
  header.find("nav li, [class*=menu] > ul > li").each((_, li) => {
    const label = text($(li).children("a").first()).slice(0, 60);
    const panelLinks = $(li).find("a").length;
    const columns = $(li).find("ul, [class*=col]").length;
    if (label && panelLinks > 6 && megaItems.length < 20) megaItems.push({ label, panelLinks, columns });
  });
  return {
    topbarLinks,
    logoAlt: (logoImg.attr("alt") ?? "").slice(0, 80),
    searchPlaceholder: ((searchInput.attr("placeholder") ?? "") + " / name=" + (searchInput.attr("name") ?? "")).slice(0, 120),
    controls: ctrls,
    megaMenuItems: megaItems,
    primaryNav: topNav($),
  };
}

function extractHomepage($: cheerio.CheerioAPI): Record<string, unknown> {
  const h2s: string[] = [];
  $("main h1, main h2").each((_, h) => {
    const t = text($(h)).slice(0, 90);
    if (t && h2s.length < 30) h2s.push(t);
  });
  const sliders = $("main [class*=swiper], main [class*=slider], main [class*=carousel], main [class*=hero], main [class*=banner]").length;
  const slides = $("main [class*=slide]").length;
  const productLinks = $("main a").filter((_, a) => /vendors\//.test($(a).attr("href") ?? "")).length;
  const categoryTiles = $("main a").filter((_, a) => {
    const href = $(a).attr("href") ?? "";
    return $(a).find("img").length > 0 && /\.htm$/.test(href) && !/vendors\//.test(href);
  }).length;
  const newsletter = {
    present: $("form").filter((_, f) => /news/i.test(text($(f)) + ($(f).attr("action") ?? ""))).length > 0,
    fields: [] as string[],
  };
  $("form").each((_, f) => {
    $(f).find("input").each((_, i) => {
      const n = (($(i).attr("name") ?? "") + ":" + ($(i).attr("type") ?? "")).slice(0, 60);
      if (n && newsletter.fields.length < 8) newsletter.fields.push(n);
    });
  });
  return { h2s, sliderRegions: sliders, slideCount: slides, productLinkCount: productLinks, categoryTileLinks: categoryTiles, newsletter };
}

function extractListing($: cheerio.CheerioAPI): Record<string, unknown> {
  const crumbs: string[] = [];
  $('[class*="breadcrumb" i] a, [class*="breadcrumb" i] li').each((_, c) => {
    const t = text($(c)).slice(0, 60);
    if (t && crumbs.length < 10) crumbs.push(t);
  });
  const filterGroups: Array<{ legend: string; options: number; optionSample: string[] }> = [];
  $("aside, [class*=filter], [class*=sidebar]").first().find("fieldset, [class*=filter-group], [class*=facet], details").each((_, g) => {
    const legend = text($(g).find("legend, summary, h1, h2, h3, h4, strong").first()).slice(0, 60);
    const opts: string[] = [];
    $(g).find("label, option, a").each((_, o) => {
      const t = text($(o)).slice(0, 50);
      if (t && opts.length < 12) opts.push(t);
    });
    if ((legend || opts.length > 0) && filterGroups.length < 15) filterGroups.push({ legend, options: $(g).find("input, option, a").length, optionSample: opts });
  });
  const sortTexts: string[] = [];
  $("select").each((_, s) => {
    $(s).find("option").each((_, o) => {
      const t = text($(o)).slice(0, 50);
      if (t && sortTexts.length < 12) sortTexts.push(t);
    });
  });
  const bodyText = ($("main").text() ?? "").replace(/\s+/g, " ");
  const countMatch = bodyText.match(/(\d[\d.]*)\s?(προϊόντα|προιοντα|products|αποτελέσματα)/i);
  const cards = $("main a").filter((_, a) => /vendors\//.test($(a).attr("href") ?? ""));
  const firstCard = cards.first();
  const pagination = {
    pageLinks: $('a[href*="page"], a[href*="/2"], .pagination a, [class*=pagination] a').length,
    loadMore: $("button, a").filter((_, el) => /περισσότερα|load more|δείτε|show more/i.test(text($(el)))).length,
  };
  return {
    breadcrumbs: crumbs,
    h1: text($("main h1").first()).slice(0, 120),
    descriptionChars: text($("main p").first()).length,
    filterGroups,
    sortOptions: sortTexts,
    productCountText: countMatch ? countMatch[0].slice(0, 60) : null,
    productCardCount: cards.length,
    firstCard: {
      text: text(firstCard).slice(0, 300),
      hasImg: firstCard.find("img").length > 0,
      imgAlt: (firstCard.find("img").first().attr("alt") ?? "").slice(0, 120),
    },
    pagination,
  };
}

function extractProduct($: cheerio.CheerioAPI): Record<string, unknown> {
  const crumbs: string[] = [];
  $('[class*="breadcrumb" i] a, [class*="breadcrumb" i] li').each((_, c) => {
    const t = text($(c)).slice(0, 60);
    if (t && crumbs.length < 10) crumbs.push(t);
  });
  const galleryImgs: Array<{ alt: string }> = [];
  $('[class*="gallery" i] img, [class*="product-image" i] img, main img').each((_, img) => {
    if (galleryImgs.length < 12) galleryImgs.push({ alt: (($(img).attr("alt") ?? "") as string).slice(0, 100) });
  });
  const mainText = ($("main").text() ?? "").replace(/\s+/g, " ");
  const priceMatches = mainText.match(/\d[\d.,]*\s?€/g) ?? [];
  const skuMatch = mainText.match(/(SKU|EAN|Barcode|Κωδικός)[\s:]*([A-Za-z0-9-]+)/i);
  const ctas: string[] = [];
  $("main button, main a, main input[type=submit]").each((_, el) => {
    const t = text($(el)).slice(0, 60);
    const foldedCta = t.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (/καλαθ|αγορ|προσθηκ|kalath|prosthk|agor|wishlist|agap|favor|add to|buy/i.test(foldedCta) && ctas.length < 8 && t) ctas.push(t);
  });
  const tabs: string[] = [];
  $('main [role="tab"], main details summary, main [class*="tab" i] button, main [class*="accordion" i] button, main h2, main h3').each((_, el) => {
    const t = text($(el)).slice(0, 70);
    if (t && tabs.length < 15) tabs.push(t);
  });
  const qty = $("main input").filter((_, i) => /qty|quantity|posot|τεμ/i.test(($(i).attr("name") ?? "") + ($(i).attr("id") ?? "") + ($(i).attr("type") ?? ""))).length;
  return {
    breadcrumbs: crumbs,
    galleryImgCount: galleryImgs.length,
    galleryAltSample: galleryImgs.slice(0, 4),
    h1: text($("main h1, h1").first()).slice(0, 200),
    skuText: skuMatch ? skuMatch[0].slice(0, 60) : null,
    priceStrings: [...new Set(priceMatches)].slice(0, 8),
    ctas,
    quantityInputs: qty,
    tabs,
    relatedProductLinks: $("main a").filter((_, a) => /vendors\//.test($(a).attr("href") ?? "")).length,
  };
}

interface Rep {
  label: string;
  expectedType: string;
  url: string;
  htmlFile: string;
}

function main(): void {
  const extra = new Map<string, string>();
  const argv = process.argv.slice(2);
  for (let i = 0; i < argv.length; i++) {
    if (argv[i]?.startsWith("--extra=") && argv[i + 1]?.startsWith("--label=")) {
      extra.set(argv[i + 1].slice("--label=".length), argv[i].slice("--extra=".length));
    }
  }

  const reps: Rep[] = [];
  try {
    const records = JSON.parse(
      fs.readFileSync(path.join(metaDir, "pages-raw.json"), "utf8"),
    ) as PageRecord[];
    const byShot = (frag: string): PageRecord | undefined =>
      records.find((r) => (r.screenshotDesktopPath ?? "").includes(frag));
    const push = (label: string, expectedType: string, rec: PageRecord | undefined) => {
      if (rec?.htmlPath) reps.push({ label, expectedType, url: rec.normalizedUrl, htmlFile: path.join(projectRoot, "reference-private", "wecare", rec.htmlPath) });
    };
    const home = records.find((r) => r.success && r.pageType === "homepage");
    push("homepage", "homepage", home);
    records.filter((r) => r.success && (r.pageType === "category" || r.pageType === "subcategory")).slice(0, 2)
      .forEach((r, i) => push(`category-${i + 1}`, r.pageType, r));
    for (const n of [1, 2, 3]) push(`product-${n}`, "product", byShot(`product-${n}`));
    push("brand", "brand", byShot("-brand"));
    // extras (blog / informational captured via shots.ts): resolve html via filename.
    for (const [label, url] of extra) {
      const file = path.join(htmlDir, `${filenameForUrl(url)}.html`);
      if (fs.existsSync(file)) reps.push({ label, expectedType: label, url, htmlFile: file });
    }
  } catch (err) {
    console.error(`cannot load pages-raw.json: ${err instanceof Error ? err.message : String(err)}`);
    process.exit(1);
  }

  const out: Record<string, unknown> = {};
  for (const rep of reps) {
    if (!fs.existsSync(rep.htmlFile)) {
      console.log(`missing html for ${rep.label} — skipped`);
      continue;
    }
    const $ = cheerio.load(fs.readFileSync(rep.htmlFile, "utf8"));
    const header = extractHeader($);
    const footer = footerColumns($);
    let body: Record<string, unknown> = {};
    if (rep.expectedType === "homepage") body = extractHomepage($);
    else if (rep.expectedType === "product") body = extractProduct($);
    else body = extractListing($);
    out[rep.label] = { url: rep.url, expectedType: rep.expectedType, header, body, footer };
    console.log(`analyzed ${rep.label} (${rep.expectedType}): ${rep.url}`);
  }

  fs.mkdirSync(metaDir, { recursive: true });
  fs.writeFileSync(path.join(metaDir, "structure.json"), JSON.stringify(out, null, 2), "utf8");
  console.log(`structure.json written (${Object.keys(out).length} pages)`);
}

main();
