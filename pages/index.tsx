import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Link from 'next/link'

const Home: NextPage = () => {

  return (
    <div className={styles.container}>
      <Head>
        <title>Leaphy Easybloqs</title>
        <meta name="description" content="Program Leaphy Robots!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to Leaphy Easybloqs!
        </h1>

        <p className={styles.description}>
          Get started by selecting a robot
        </p>

        <div className={styles.grid}>
          <div className={styles.card}>
            <Link href="/blockly/orig">
              <a>
                <Image src="/orig.svg" alt="Leaphy Original Icon" width={180} height={180} />
                Leaphy Original
              </a>
            </Link>
          </div>

          <div className={styles.card}>
            <Link href="/blockly/flitz" >
              <a>
                <Image src="/flitz.svg" alt="Leaphy Flitz Icon" width={180} height={180} />
                Leaphy Flitz
              </a>
            </Link>
          </div>

          <div className={styles.card}>
            <Link href="/blockly/click" >
              <a>
                <Image src="/click.svg" alt="Leaphy Click Icon" width={180} height={180} />
                Leaphy Click
              </a>
            </Link>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://www.leaphy.nl"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/leaphy-logo-color.svg" alt="Leaphy Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}

export default Home
