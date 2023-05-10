import { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Link from 'next/link'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));



export default function Home() {
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [allPredictions, setAllPredictions] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/predictions", {
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
      prediction.status !== "已完成" //配合nginx替换
    ) {
      await sleep(1000);
      const response = await fetch("/api/predictions/" + prediction.id);
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
        <p>
          请选择想要运行的模型
        </p>
         <small style={
          {
          fontStyle: 'italic',
          }
        }>
          如果长时间启动中, 请等待2-3分钟.
        </small> 
      </div>
      
      <div className={styles.body}>
        {/* 选择模型: 
      <form name="demo">
  <label>
    anything
    <input type="radio" value="mario" name="characters" checked />
  </label>
  <label>
  stable-diffusion
    <input type="radio" value="luigi" name="characters" />
  </label>
</form> */}
        
        <form className={styles.form1} method="get" action="/anything-v3">
          <button type="submit">Anything-v3</button>
        </form>
        <form className={styles.form1} method="get" action="/anything-v4">
          <button type="submit">Anything-v4</button>
        </form>
        <form className={styles.form1} method="get" action="/danbooru">
          <button type="submit">Danbooru</button>
        </form>
        <form className={styles.form1} method="get" action="/pastel-mix">
          <button type="submit">Pastel-mix</button>
        </form>
        
        <div>
    </div>
        {error && <div>{error}</div>}

        {prediction && (
          <div>
            {prediction.output && (
              <div className={styles.imageWrapper}>
                <Image
                  fill
                  src={prediction.output[prediction.output.length - 1]}
                  alt="output"
                  sizes='100vw'
                />
              </div>
            )}
            <p>状态: {prediction.status}&nbsp;&nbsp;模型: anything-v3</p>
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