import React, { FunctionComponent, useEffect, useState } from "react";
import ReactDOM, { createPortal } from "react-dom";
import { css } from "@emotion/css";
import { useAttributes, useProduct, useSaveProduct } from "./hooks";
import useHotkeys from "@reecelucas/react-use-hotkeys";

const Product: FunctionComponent<{ post: Element }> = ({ post }) => {
  const [position, setPosition] = useState({
    left: 0,
    top: 0
  });
  const [active, setActive] = useState(false);
  const [hover, setHover] = useState(false);
  const product = useProduct(post, active);
  const initialAttributes = useAttributes(product);
  const [attributes, setAttributes] = useState(initialAttributes);
  useEffect(() => {
    Object.keys(initialAttributes).forEach((k) => {
      const key = k as keyof typeof initialAttributes;
      if (!attributes[key] || (key === "description" && attributes.description.endsWith("Xem thêm"))) {
        setAttributes(a => ({
          ...a,
          [key]: initialAttributes[key]
        }));
      }
    });
  }, [active]);
  const save = useSaveProduct({
    ...product,
    ...attributes
  });
  useHotkeys("Escape", () => {
    setActive(false);
    setHover(false);
  });

  return <div className={css({ position: "relative" })}>
    <div
      onMouseMove={(e) => {
        if (!active) {
          setPosition({
            left: e.clientX,
            top: e.clientY
          });
        }
      }}
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
      left: position.left + 4,
      top: position.top + 4,
      width: 300,
      backgroundColor: "whitesmoke",
      borderRadius: 8,
      boxShadow: "0 1px 2px var(--shadow-2)",
      display: "flex",
      flexDirection: "column",
      maxHeight: "50vh",
      overflowY: "auto"
    })}>
      <div className={css({
        display: "flex"
      })}>
        {Object.keys(attributes).filter(key => key.toLowerCase().includes("price")).map((key) => <div className={css({
          margin: 8,
          marginBottom: 0
        })}>
          <h3 className={css({
            textTransform: "uppercase",
            marginBottom: 4
          })}>{key}</h3>
          <input
            type="number"
            className={css({
              width: "100%",
              borderRadius: 8,
              boxSizing: "border-box",
              border: "1px solid #ccd0d5"
            })}
            value={attributes[key as keyof typeof attributes]}
            onChange={e => setAttributes(a => ({
              ...a,
              [key]: e.target.value
            }))}
          />
        </div>)}
      </div>
      {Object.keys(attributes).filter(key => !key.toLowerCase().includes("price")).map((key) => <div className={css({
        margin: 8,
        marginBottom: 0
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
          })}
          value={attributes[key as keyof typeof attributes]}
          onChange={e => setAttributes(a => ({
            ...a,
            [key]: e.target.value
          }))}
        />
      </div>)}
      <p className={css({
        display: "flex",
        flex: "none",
        overflowX: "auto",
        marginBottom: 0
      })}>{product.images.map(image => <img className={css({
        maxHeight: 128,
        objectFit: "cover"
      })} key={image} src={image} />)}</p>
      <button
        onClick={save}
        className={css({
          backgroundColor: "#1877f2",
          color: "white",
          padding: "8px 12px",
          fontWeight: "bold",
          borderRadius: 8,
          border: "none",
          margin: 8
        })}
      >Save
      </button>
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
