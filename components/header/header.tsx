import Image from 'next/image'
import styles from '../../styles/Header.module.css'

const Header = () => {
    return(<div className={styles.container}>
        <Image className={styles.logo} src="/leaphy-logo.svg" alt="Leaphy Easybloqs Logo" width={224} height={18} />
    </div>)
}

export default Header