import Image from 'next/image'
import styles from '../../styles/Header.module.css'

const Header = () => {
    return(<div className={styles.container}>
        <Image src="/leaphy-logo.svg" alt="Leaphy Easybloqs Logo" width={72} height={16} />
    </div>)
}

export default Header