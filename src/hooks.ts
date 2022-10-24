import { useMemo } from "react";
import { Product } from "./model";
import configs from "./config";

export const useProduct = (post: Element, active: boolean) => {
  const product = useMemo<Product>(() => {
    const root = post.parentElement!.parentElement!;
    const images = Array.from(root.querySelectorAll<HTMLImageElement>("img.x1ey2m1c.xds687c.x5yr21d.x10l6tqk.x17qophe.x13vifvy.xh8yej3")).map(img => img.src);
    const content = root.querySelector<HTMLDivElement>(".x193iq5w.xeuugli.x13faqbe.x1vvkbs.xlh3980.xvmahel.x1n0sxbx.x1lliihq.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.x4zkp8e.x3x7a5m.x6prxxf.xvq8zen.xo1l8bm.xzsf02u.x1yc453h")!;
    const viewMore = content.querySelector<HTMLButtonElement>(".x1i10hfl.xjbqb8w.x6umtig.x1b1mbwd.xaqea5y.xav7gou.x9f619.x1ypdohk.xt0psk2.xe8uvvx.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x16tdsg8.x1hl2dhg.xggy1nq.x1a2a7pz.xt0b8zv.xzsf02u.x1s688f");
    if (viewMore && viewMore.innerText === "Xem thêm") {
      setTimeout(() => {
        viewMore.click();
      }, 0);
    }
    const contentImages = content.querySelectorAll("img");
    Array.from(contentImages).forEach(ci => ci.outerHTML = ci.alt);
    const description = content.innerText;
    return {
      name: "",
      description,
      images
    };
  }, [post, active]);

  return product;
};

function includesIgnoreCase(a: string, b: string) {
  return a.trim().toLowerCase().includes(b.trim().toLowerCase());
}

export const useAttributes = (product: Product) => {
  const description = product.description;
  const lines = description.split("\n");
  const attributes = {
    description: description,
    price: "",
    size: "",
    glass: "",
    material: "",
    wr: ""
  };
  lines.forEach(line => {
    function extractInfo(regex: RegExp, key: keyof typeof attributes) {
      const matches = regex.exec(line);
      if (matches && matches.groups) {
        const { groups: { info } } = matches;
        if (info) {
          attributes[key] = info;
        }
      }
    }

    extractInfo(/(?<info>\d+)k/g, "price");
    extractInfo(/(?<info>\d+)mm/g, "size");
    extractInfo(/kính (?<info>[^,.\n]+)/gi, "glass");
    extractInfo(/dây (?<info>[^,.\n]+)/gi, "material");
    extractInfo(/nước.* (?<info>\d+)m/g, "wr");
  });
  return attributes;
};

export const useSaveProduct = (product: Product) => {
  return async () => {
    const response = await fetch(`${configs.API_HOST}:${configs.API_PORT}/save-product`, {
      body: JSON.stringify(product),
    });
    const result = await response.json();
    return result;
  }
}