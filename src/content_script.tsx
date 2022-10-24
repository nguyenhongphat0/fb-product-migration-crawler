import React, { FunctionComponent, useEffect, useMemo, useState } from "react";
import ReactDOM, { createPortal } from "react-dom";
import { css } from "@emotion/css";
import { Product } from "./model";
import { useAttributes, useProduct } from "./hooks";

const Product: FunctionComponent<{ post: Element }> = ({ post }) => {
  const [position, setPosition] = useState({
    left: 0,
    top: 0
  });
  const [active, setActive] = useState(false);
  const [hover, setHover] = useState(false);
  const product = useProduct(post, active);
  const attributes = useAttributes(product);

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
      {Object.keys(attributes).map((key) => <div className={css({
        padding: 8
      })}>
        <h3 className={css({
          textTransform: "uppercase",
          marginBottom: 4
        })}>{key}</h3>
        <textarea
          rows={key === "description" ? 4 : 1}
          className={css({
            width: "100%",
            borderRadius: 8,
            boxSizing: "border-box"
          })} value={attributes[key as keyof typeof attributes]} />
      </div>)}
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
