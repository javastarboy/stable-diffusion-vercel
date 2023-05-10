import { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));



export default function Home() {
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [allPredictions, setAllPredictions] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/predictions/anything-v4", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: e.target.prompt.value,
      }),
    });
    let prediction = await response.json();
    let disabled = false
    if (response.status !== 201) {
      setError(prediction.detail);
      disabled = true
      return;
    }
    setPrediction(prediction);

    while (
      prediction.status !== "succeeded" &&
      prediction.status !== "failed" &&
      prediction.status !== "失败,可能检测到色情" && //配合nginx替换
      prediction.status !== "已完成" //配合nginx替换
    ) {
      await sleep(1000);
      const response = await fetch("/api/" + prediction.id);
      prediction = await response.json();
      if (response.status !== 200) {
        setError(prediction.detail);
        return;
      }
      console.log({ prediction })
      setPrediction(prediction);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Stable Diffusion - Moeyy</title>
      </Head>
      <div className={styles.header}>
        <h1>
        使用 AI 绘画动漫图
        </h1>
        {/* <p>
          输入英文关键词进行生成图片。
        </p> */}
        {/* <p style={
          {
          fontStyle: 'italic',
          }
        }>
          Website by Carson Rodrigues
        </p> */}
      </div>
      <div className={styles.body}>
        
        <form className={styles.form} onSubmit={handleSubmit}>
          <input type="text" name="prompt" placeholder="输入英文关键词来生成图像" />
          <button type="submit">生成</button>
        </form>
        <form className={styles.form1} method="get" action="/">
          <button type="submit">选择模型</button>
        </form>
        
        <div>
    </div>
        {error && <div>{error}</div>}

        {prediction && (
          <div>
            {prediction.output && (
              <div className={styles.imageWrapper}>
                <a href={prediction.output[prediction.output.length - 1]} target="_blank" rel="noopener noreferrer" title="点击下载原图">
                  <Image
                  fill
                  src={prediction.output[prediction.output.length - 1]}
                  alt="output"
                  sizes='100vw'
                />
                </a>
              </div>
            )}
            <p>状态: {prediction.status}&nbsp;&nbsp;&nbsp;&nbsp;模型: anything-v4</p>
          </div>
        )}
      </div>
      {/* <div className={styles.carousel}>
      <h2>
        历史生成:
        </h2>
        <div style={{
          margin: 'auto',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          alignContent: 'center',
          width: '100%',
        }}> 
        {allPredictions && allPredictions.map((prediction, i) => (
          <Image
            key={i}
            width={200}
            height={200}
            src={prediction.output[prediction.output.length - 1]}
            alt={`output ${i}`}
            style={{
              margin: '10px',
              borderRadius: '10px',
              boxShadow: '0 0 10px 0 rgba(0,0,0,0.5)'

            }}
            />
        ))}
          </div>
      </div> */}
      <div className="text-center lil-text mt-8">


      </div>

    </div>
  );
}