import React, { FunctionComponent, useEffect, useMemo, useState } from "react";
import ReactDOM, { createPortal } from "react-dom";
import { css } from "@emotion/css";
import { Product } from "./model";

const Product: FunctionComponent<{ post: Element }> = ({ post }) => {
  const [position, setPosition] = useState({
    left: 0,
    top: 0
  });
  const [active, setActive] = useState(false);
  const [hover, setHover] = useState(false);
  const product = useMemo<Product>(() => {
    const root = post.parentElement!.parentElement!;
    const images = Array.from(root.querySelectorAll<HTMLImageElement>("img.x1ey2m1c.xds687c.x5yr21d.x10l6tqk.x17qophe.x13vifvy.xh8yej3")).map(img => img.src);
    const content = root.querySelector<HTMLDivElement>(".x193iq5w.xeuugli.x13faqbe.x1vvkbs.xlh3980.xvmahel.x1n0sxbx.x1lliihq.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.x4zkp8e.x3x7a5m.x6prxxf.xvq8zen.xo1l8bm.xzsf02u.x1yc453h")!;
    const viewMore = content.querySelector<HTMLButtonElement>(".x1i10hfl.xjbqb8w.x6umtig.x1b1mbwd.xaqea5y.xav7gou.x9f619.x1ypdohk.xt0psk2.xe8uvvx.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x16tdsg8.x1hl2dhg.xggy1nq.x1a2a7pz.xt0b8zv.xzsf02u.x1s688f");
    if (viewMore && viewMore.innerText === "Xem thêm") {
      viewMore.click();
    }
    const description = content ? content.innerText : "";
    return {
      name: "",
      description,
      images
    };
  }, [post, active]);

  return <div className={css({ position: "relative" })}>
    <div
      onMouseMove={(e) => setPosition({
        left: e.clientX,
        top: e.clientY
      })}
      onMouseEnter={() => setHover(true)}
      onMouseOut={() => setHover(false)}
      onClick={() => setActive(a => !a)}
      className={css({
        backgroundColor: active ? "lightblue" : "whitesmoke",
        padding: 8,
        width: 20,
        height: 20,
        marginLeft: 4,
        borderRadius: "100%",
        cursor: "pointer",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      })}
    >
      ⌚️
    </div>
    {(active || hover) && createPortal(<div className={css({
      position: "fixed",
      zIndex: 1000,
      left: position.left,
      top: position.top,
      width: 300,
      backgroundColor: "whitesmoke",
      borderRadius: 8,
      boxShadow: "0 1px 2px var(--shadow-2)",
      display: "flex",
      flexDirection: "column"
    })}>
      <h1>{product.name}</h1>
      <p dangerouslySetInnerHTML={{ __html: product.description }}></p>
      <p className={css({
        display: "flex",
        overflowX: "auto"
      })}>{product.images.map(image => <img className={css({
        maxHeight: 128,
        objectFit: "cover"
      })} key={image} src={image} />)}</p>
    </div>, document.body)}
  </div>;
};

const Popup = () => {
  const [posts, setPosts] = useState<Element[]>([]);
  useEffect(() => {
    const handleScroll = () => {
      const newPosts = Array.from(document.querySelectorAll(".x1cy8zhl.x78zum5.x1q0g3np.xod5an3.x1pi30zi.x1swvt13.xz9dl7a"));
      setPosts(ps => ps.filter(p => !newPosts.includes(p)).concat(newPosts));
    };
    document.addEventListener("scroll", handleScroll);
    return () => document.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div className={css({
        position: "fixed",
        left: 24,
        top: 24
      })}>
        {posts.map((post, i) => createPortal(<Product key={i} post={post} />, post))}
      </div>
    </>
  );
};

const extensionRoot = document.createElement("div");
document.body.appendChild(extensionRoot);

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  extensionRoot
);
